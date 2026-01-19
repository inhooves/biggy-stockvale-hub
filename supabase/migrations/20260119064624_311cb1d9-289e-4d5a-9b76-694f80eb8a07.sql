-- Create member_profiles table to store username and link to auth.users
CREATE TABLE public.member_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    agent_customer_id UUID REFERENCES public.agent_customers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own profile
CREATE POLICY "Users can view their own member profile"
ON public.member_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own member profile"
ON public.member_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can insert their own profile during signup
CREATE POLICY "Users can insert their own member profile"
ON public.member_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_member_profiles_updated_at
BEFORE UPDATE ON public.member_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();