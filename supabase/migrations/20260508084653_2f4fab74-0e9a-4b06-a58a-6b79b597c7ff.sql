-- Drop the SECURITY DEFINER summary function that bypassed admin-only RLS on registered_members.
-- It is not used anywhere in the application.
DROP FUNCTION IF EXISTS public.get_registered_members_summary();

-- Remove the broad SELECT policy that allowed anyone to list objects in the public agent-profiles bucket.
-- Public files remain reachable via their direct public URL because the bucket itself is public,
-- but clients can no longer enumerate the contents of the bucket.
DROP POLICY IF EXISTS "Anyone can view agent profile pics" ON storage.objects;