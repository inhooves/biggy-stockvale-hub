-- Fix 1: Restrict agents table SELECT policy - only allow agents to view their own profile
-- and admins to view all agents (instead of allowing ALL authenticated users to see ALL agents)
DROP POLICY IF EXISTS "Authenticated users can view agents" ON public.agents;

-- Create new restrictive SELECT policy
CREATE POLICY "Agents can view their own profile or admins can view all" 
ON public.agents 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Fix 2: Add additional safeguard for agent_customers table by adding explicit user_id check
-- The get_agent_id function is secure, but we add a redundant check for defense-in-depth
-- This ensures even if get_agent_id() had a bug, the user_id check would still protect data
DROP POLICY IF EXISTS "Agents can view their own customers" ON public.agent_customers;
DROP POLICY IF EXISTS "Agents can insert their own customers" ON public.agent_customers;
DROP POLICY IF EXISTS "Agents can update their own customers" ON public.agent_customers;
DROP POLICY IF EXISTS "Agents can delete their own customers" ON public.agent_customers;

-- Recreate with defense-in-depth: check both agent_id matches AND the agent's user_id matches auth.uid()
CREATE POLICY "Agents can view their own customers" 
ON public.agent_customers 
FOR SELECT 
USING (
  (agent_id = get_agent_id(auth.uid()) AND EXISTS (
    SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()
  ))
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Agents can insert their own customers" 
ON public.agent_customers 
FOR INSERT 
WITH CHECK (
  agent_id = get_agent_id(auth.uid()) 
  AND EXISTS (
    SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Agents can update their own customers" 
ON public.agent_customers 
FOR UPDATE 
USING (
  agent_id = get_agent_id(auth.uid()) 
  AND EXISTS (
    SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Agents can delete their own customers" 
ON public.agent_customers 
FOR DELETE 
USING (
  agent_id = get_agent_id(auth.uid()) 
  AND EXISTS (
    SELECT 1 FROM public.agents WHERE id = agent_id AND user_id = auth.uid()
  )
);