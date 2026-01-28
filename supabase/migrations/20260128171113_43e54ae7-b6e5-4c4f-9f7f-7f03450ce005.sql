-- Create a public view for agents showing only name and surname
-- Using security_definer to bypass RLS on base table
CREATE OR REPLACE VIEW public.registered_members_summary
WITH (security_invoker = false)
AS
  SELECT id, name, surname
  FROM public.registered_members;

-- Grant SELECT on the view to authenticated users
GRANT SELECT ON public.registered_members_summary TO authenticated;

-- Create RLS policy for the view to allow agents and admins
ALTER VIEW public.registered_members_summary SET (security_barrier = true);

-- Add policy comment for documentation
COMMENT ON VIEW public.registered_members_summary IS 'Limited view of registered members for agents - shows only name and surname';