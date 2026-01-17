-- Create function to auto-assign agent role when agent record is created
CREATE OR REPLACE FUNCTION public.auto_assign_agent_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'agent')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign agent role on insert
DROP TRIGGER IF EXISTS assign_agent_role_on_insert ON public.agents;
CREATE TRIGGER assign_agent_role_on_insert
AFTER INSERT ON public.agents
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_agent_role();