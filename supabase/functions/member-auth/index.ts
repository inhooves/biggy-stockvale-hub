import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role client to bypass RLS for username lookups
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { action, username, email } = await req.json();

    if (action === 'lookup-username') {
      // Lookup username -> email mapping for login
      if (!username || typeof username !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Username is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate username format to prevent injection
      const sanitizedUsername = username.toLowerCase().trim();
      if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
        return new Response(
          JSON.stringify({ error: 'Invalid username format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Find member profile by username
      const { data: memberProfile, error: profileError } = await supabaseAdmin
        .from('member_profiles')
        .select('user_id, agent_customer_id')
        .eq('username', sanitizedUsername)
        .maybeSingle();

      if (profileError || !memberProfile) {
        // Don't reveal if username exists or not (prevents enumeration)
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get email from agent_customers
      const { data: agentCustomer, error: customerError } = await supabaseAdmin
        .from('agent_customers')
        .select('email, name')
        .eq('id', memberProfile.agent_customer_id)
        .maybeSingle();

      if (customerError || !agentCustomer?.email) {
        return new Response(
          JSON.stringify({ error: 'Account configuration error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ email: agentCustomer.email, name: agentCustomer.name }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'check-username-available') {
      // Check if username is available for signup
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
      // Lookup member details by email for signup flow
      if (!email || typeof email !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const sanitizedEmail = email.toLowerCase().trim();
      
      // Basic email format validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Find member by email in agent_customers
      const { data: existingMember, error: lookupError } = await supabaseAdmin
        .from('agent_customers')
        .select('id, name, surname, email, phone, id_number, gender, address, city, date_of_birth')
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

      // Check if member already has an account
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

      // Return member details (redact sensitive info like full ID number)
      return new Response(
        JSON.stringify({
          found: true,
          hasAccount: false,
          member: {
            id: existingMember.id,
            name: existingMember.name,
            surname: existingMember.surname,
            email: existingMember.email,
            phone: existingMember.phone ? `***${existingMember.phone.slice(-4)}` : null, // Partial phone
            id_number: existingMember.id_number ? `${existingMember.id_number.slice(0, 6)}******` : null, // Partial ID
            gender: existingMember.gender,
            address: existingMember.address,
            city: existingMember.city,
            date_of_birth: existingMember.date_of_birth,
          }
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
