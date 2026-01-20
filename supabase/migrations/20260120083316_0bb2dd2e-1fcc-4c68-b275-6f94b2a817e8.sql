-- Fix 1: Add DELETE policy for agents table (allow admins to delete agents)
CREATE POLICY "Admins can delete agents" 
ON public.agents 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Drop and recreate storage policies with proper ownership checks
DROP POLICY IF EXISTS "Users can update their own profile pics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload agent profiles" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view agent profile pics" ON storage.objects;

-- Recreate with ownership checks - users can only manage their own files in their folder
CREATE POLICY "Users can upload their own profile pics"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'agent-profiles' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own profile pics"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'agent-profiles' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own profile pics"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'agent-profiles' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view agent profile pics"
ON storage.objects FOR SELECT
USING (bucket_id = 'agent-profiles');

-- Fix 3: Replace permissive INSERT policy on registered_members with proper validation
DROP POLICY IF EXISTS "Anyone can register as a member" ON public.registered_members;

-- Allow anyone to insert BUT validate the data format through the policy
-- Since this is a public registration form, we still allow unauthenticated inserts
-- but could add authentication requirement if needed
CREATE POLICY "Anyone can register as a member" 
ON public.registered_members 
FOR INSERT 
WITH CHECK (
  -- Validate required fields are not empty
  name IS NOT NULL AND name != '' AND
  surname IS NOT NULL AND surname != '' AND
  email IS NOT NULL AND email != '' AND
  phone IS NOT NULL AND phone != '' AND
  id_number IS NOT NULL AND id_number != '' AND
  gender IS NOT NULL AND gender != '' AND
  referral_source IS NOT NULL AND referral_source != '' AND
  date_of_birth IS NOT NULL
);