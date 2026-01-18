-- Add new columns to agent_customers table for member registration
ALTER TABLE public.agent_customers 
ADD COLUMN IF NOT EXISTS surname text,
ADD COLUMN IF NOT EXISTS id_number text,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS id_photo_url text;

-- Add gender column to agents table for agent rankings display
ALTER TABLE public.agents
ADD COLUMN IF NOT EXISTS gender text;