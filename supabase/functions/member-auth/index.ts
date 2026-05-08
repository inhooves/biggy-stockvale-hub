import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory IP rate limiter (per-instance best effort)
const rateBuckets = new Map<string, { count: number; reset: number }>();
function checkRate(ip: string, key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const k = `${key}:${ip}`;
  const b = rateBuckets.get(k);
  if (!b || now > b.reset) {
    rateBuckets.set(k, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}

function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***';
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${'*'.repeat(Math.max(1, local.length - visible.length))}@${domain}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const ip = clientIp(req);

    const { action, username, password, email } = await req.json();

    // ===== Server-side login: username + password -> session =====
    if (action === 'login-with-username' || action === 'lookup-username') {
      if (!checkRate(ip, 'login', 8, 60_000)) {
        return new Response(
          JSON.stringify({ error: 'Too many attempts. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const sanitizedUsername = username.toLowerCase().trim();
      if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: memberProfile } = await supabaseAdmin
        .from('member_profiles')
        .select('user_id, agent_customer_id')
        .eq('username', sanitizedUsername)
        .maybeSingle();

      // Generic 401 regardless of cause to prevent enumeration
      const invalid = () => new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

      if (!memberProfile) return invalid();

      const { data: agentCustomer } = await supabaseAdmin
        .from('agent_customers')
        .select('email, name')
        .eq('id', memberProfile.agent_customer_id)
        .maybeSingle();

      if (!agentCustomer?.email) return invalid();

      // Perform sign-in server-side using anon client; never expose the email
      const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
        email: agentCustomer.email,
        password,
      });

      if (signInError || !signInData.session) return invalid();

      return new Response(
        JSON.stringify({
          session: {
            access_token: signInData.session.access_token,
            refresh_token: signInData.session.refresh_token,
          },
          name: agentCustomer.name,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'check-username-available') {
      if (!checkRate(ip, 'check', 20, 60_000)) {
        return new Response(
          JSON.stringify({ available: false, error: 'Too many requests' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (!username || typeof username !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Username is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const sanitizedUsername = username.toLowerCase().trim();
      if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
        return new Response(
          JSON.stringify({ available: false, error: 'Invalid username format' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: existingProfile } = await supabaseAdmin
        .from('member_profiles')
        .select('id')
        .eq('username', sanitizedUsername)
        .maybeSingle();

      return new Response(
        JSON.stringify({ available: !existingProfile }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'lookup-member-by-email') {
      if (!checkRate(ip, 'lookup', 5, 60_000)) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!email || typeof email !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const sanitizedEmail = email.toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: existingMember, error: lookupError } = await supabaseAdmin
        .from('agent_customers')
        .select('id, name, surname, email, phone, id_number')
        .eq('email', sanitizedEmail)
        .maybeSingle();

      if (lookupError) {
        console.error('Error looking up member:', lookupError);
        return new Response(
          JSON.stringify({ error: 'Lookup failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!existingMember) {
        return new Response(
          JSON.stringify({ found: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: existingProfile } = await supabaseAdmin
        .from('member_profiles')
        .select('id')
        .eq('agent_customer_id', existingMember.id)
        .maybeSingle();

      if (existingProfile) {
        return new Response(
          JSON.stringify({ found: true, hasAccount: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Return only minimal verification fields. Mask sensitive identifiers.
      // Do NOT return address, city, gender, date_of_birth, or full email.
      return new Response(
        JSON.stringify({
          found: true,
          hasAccount: false,
          member: {
            id: existingMember.id,
            name: existingMember.name,
            surname: existingMember.surname,
            email: maskEmail(existingMember.email),
            phone: existingMember.phone ? `***${existingMember.phone.slice(-4)}` : null,
            id_number: existingMember.id_number ? `${existingMember.id_number.slice(0, 2)}******` : null,
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Member auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
