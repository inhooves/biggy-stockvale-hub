
-- Revert: Allow unauthenticated registration (required for the registration flow)
DROP POLICY IF EXISTS "Authenticated users can register as a member" ON public.registered_members;

CREATE POLICY "Anyone can register as a member"
ON public.registered_members
FOR INSERT
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
