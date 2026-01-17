-- Add referral tracking columns to agent_customers table
ALTER TABLE public.agent_customers 
ADD COLUMN referral_source TEXT,
ADD COLUMN recruited_by_agent_id UUID REFERENCES public.agents(id);