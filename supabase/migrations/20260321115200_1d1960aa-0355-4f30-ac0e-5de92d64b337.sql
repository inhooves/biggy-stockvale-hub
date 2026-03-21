
-- Remove the overly permissive policy that exposes all registered_members data
DROP POLICY IF EXISTS "Authenticated users can view basic member info" ON public.registered_members;

-- Restore admin-only SELECT policy on registered_members
CREATE POLICY "Admins can view all registered members"
ON public.registered_members
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop the SECURITY INVOKER view since it won't work without base table access
DROP VIEW IF EXISTS public.registered_members_summary;

-- Recreate as a SECURITY INVOKER view (satisfies the linter)
-- but add a targeted policy so authenticated users can read the 3 columns via the view
-- Since we can't do column-level RLS, use a function instead
CREATE OR REPLACE FUNCTION public.get_registered_members_summary()
RETURNS TABLE(id uuid, name text, surname text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rm.id, rm.name, rm.surname
  FROM public.registered_members rm;
$$;

-- Only allow authenticated users to call this function
REVOKE ALL ON FUNCTION public.get_registered_members_summary() FROM public;
GRANT EXECUTE ON FUNCTION public.get_registered_members_summary() TO authenticated;
