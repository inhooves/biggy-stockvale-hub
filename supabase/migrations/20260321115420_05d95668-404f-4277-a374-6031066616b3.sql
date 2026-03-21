
-- Fix 1: Restrict registered_members INSERT to authenticated users only
DROP POLICY IF EXISTS "Anyone can register as a member" ON public.registered_members;

CREATE POLICY "Authenticated users can register as a member"
ON public.registered_members
FOR INSERT
TO authenticated
WITH CHECK (
  name IS NOT NULL AND name != '' AND
  surname IS NOT NULL AND surname != '' AND
  email IS NOT NULL AND email != '' AND
  phone IS NOT NULL AND phone != '' AND
  id_number IS NOT NULL AND id_number != '' AND
  gender IS NOT NULL AND gender != '' AND
  referral_source IS NOT NULL AND referral_source != '' AND
  date_of_birth IS NOT NULL
);

-- Fix 2: Add explicit INSERT policy on user_roles to prevent privilege escalation
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
