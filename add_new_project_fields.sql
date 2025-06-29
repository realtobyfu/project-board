-- Add new fields to projects table
ALTER TABLE projects 
ADD COLUMN contact_name TEXT,
ADD COLUMN collaboration_preference TEXT CHECK (collaboration_preference IN ('remote', 'in-person', 'flexible')),
ADD COLUMN location TEXT;

-- Update RLS policies if needed (existing policies should work fine with new columns)