-- Create app_role enum for role management
CREATE TYPE public.app_role AS ENUM ('admin', 'agent', 'user');

-- Create agents table
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  ref_number TEXT NOT NULL UNIQUE,
  profile_pic_url TEXT,
  customers_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent_customers table
CREATE TABLE public.agent_customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get agent id from user id
CREATE OR REPLACE FUNCTION public.get_agent_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.agents WHERE user_id = _user_id
$$;

-- RLS Policies for agents table
CREATE POLICY "Agents can view their own profile"
ON public.agents FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Agents can update their own profile"
ON public.agents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert agents"
ON public.agents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for agent_customers table
CREATE POLICY "Agents can view their own customers"
ON public.agent_customers FOR SELECT
USING (agent_id = public.get_agent_id(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Agents can insert their own customers"
ON public.agent_customers FOR INSERT
WITH CHECK (agent_id = public.get_agent_id(auth.uid()));

CREATE POLICY "Agents can update their own customers"
ON public.agent_customers FOR UPDATE
USING (agent_id = public.get_agent_id(auth.uid()));

CREATE POLICY "Agents can delete their own customers"
ON public.agent_customers FOR DELETE
USING (agent_id = public.get_agent_id(auth.uid()));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Function to update customer count
CREATE OR REPLACE FUNCTION public.update_agent_customer_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.agents SET customers_count = customers_count + 1, updated_at = now() WHERE id = NEW.agent_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.agents SET customers_count = customers_count - 1, updated_at = now() WHERE id = OLD.agent_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger to update customer count
CREATE TRIGGER update_customer_count
AFTER INSERT OR DELETE ON public.agent_customers
FOR EACH ROW EXECUTE FUNCTION public.update_agent_customer_count();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_customers_updated_at
BEFORE UPDATE ON public.agent_customers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for agent profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('agent-profiles', 'agent-profiles', true);

-- Storage policies for agent profile pictures
CREATE POLICY "Anyone can view agent profiles"
ON storage.objects FOR SELECT
USING (bucket_id = 'agent-profiles');

CREATE POLICY "Authenticated users can upload agent profiles"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'agent-profiles' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile pics"
ON storage.objects FOR UPDATE
USING (bucket_id = 'agent-profiles' AND auth.role() = 'authenticated');

-- Enable realtime for agents and customers
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_customers;