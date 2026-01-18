-- Add city and date_of_birth columns to agent_customers table
ALTER TABLE public.agent_customers 
ADD COLUMN city text,
ADD COLUMN date_of_birth date;