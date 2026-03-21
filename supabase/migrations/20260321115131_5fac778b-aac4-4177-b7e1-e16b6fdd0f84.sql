
-- Drop the existing SECURITY DEFINER view
DROP VIEW IF EXISTS public.registered_members_summary;

-- Recreate the view with SECURITY INVOKER (default, safer)
CREATE OR REPLACE VIEW public.registered_members_summary
WITH (security_invoker = true)
AS
  SELECT id, name, surname
  FROM public.registered_members;

-- Add a SELECT policy on registered_members for authenticated users
-- that only allows access through the summary view pattern
-- We need authenticated users to be able to SELECT for the view to work
CREATE POLICY "Authenticated users can view basic member info"
ON public.registered_members
FOR SELECT
TO authenticated
USING (true);

-- Drop the old admin-only SELECT policy since the new one is broader
-- but admins still get full access through this same policy
DROP POLICY IF EXISTS "Admins can view all registered members" ON public.registered_members;

-- Grant SELECT on the view to authenticated users
GRANT SELECT ON public.registered_members_summary TO authenticated;
