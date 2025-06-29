-- Add contact information fields to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS contact_method TEXT CHECK (contact_method IN ('email', 'phone', 'discord')),
ADD COLUMN IF NOT EXISTS contact_info TEXT;

-- Create indexes for potential searching
CREATE INDEX IF NOT EXISTS idx_projects_contact_method ON public.projects(contact_method);