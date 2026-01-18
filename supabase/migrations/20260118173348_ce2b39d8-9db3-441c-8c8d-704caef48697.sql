-- Add explicit policies to block unauthenticated access to agents table
-- First, drop existing policies to recreate with proper restrictions
DROP POLICY IF EXISTS "Agents can view their own profile" ON public.agents;

-- Create new SELECT policy that requires authentication
CREATE POLICY "Agents can view their own profile"
ON public.agents
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

-- Add policy to allow agents to view all agents for ranking feature (authenticated only)
CREATE POLICY "Authenticated agents can view all agent rankings"
ON public.agents
FOR SELECT
TO authenticated
USING (true);

-- Drop the redundant policy we just created (keep only one SELECT policy)
DROP POLICY IF EXISTS "Authenticated agents can view all agent rankings" ON public.agents;

-- Update the policy to allow authenticated users to see all agents for rankings
DROP POLICY IF EXISTS "Agents can view their own profile" ON public.agents;

CREATE POLICY "Authenticated users can view agents"
ON public.agents
FOR SELECT
TO authenticated
USING (true);

-- Add explicit policies to block unauthenticated access to agent_customers table
DROP POLICY IF EXISTS "Agents can view their own customers" ON public.agent_customers;

CREATE POLICY "Agents can view their own customers"
ON public.agent_customers
FOR SELECT
TO authenticated
USING ((agent_id = get_agent_id(auth.uid())) OR has_role(auth.uid(), 'admin'::app_role));