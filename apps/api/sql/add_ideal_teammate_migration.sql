-- Add ideal teammate requirements field to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS ideal_teammate TEXT[];