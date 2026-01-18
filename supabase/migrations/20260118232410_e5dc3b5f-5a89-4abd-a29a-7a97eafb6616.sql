
-- Create table for self-registered members
CREATE TABLE public.registered_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  id_number TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  address TEXT,
  city TEXT,
  referral_source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registered_members ENABLE ROW LEVEL SECURITY;

-- Only admins can view registered members
CREATE POLICY "Admins can view all registered members"
ON public.registered_members
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public insert (for registration form)
CREATE POLICY "Anyone can register as a member"
ON public.registered_members
FOR INSERT
WITH CHECK (true);

-- Only admins can update
CREATE POLICY "Admins can update registered members"
ON public.registered_members
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete registered members"
ON public.registered_members
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_registered_members_updated_at
BEFORE UPDATE ON public.registered_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
