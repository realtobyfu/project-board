-- Add status field to projects table
ALTER TABLE projects 
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;

-- Update all existing projects to have 'active' status
UPDATE projects 
SET status = 'active' 
WHERE status IS NULL;

-- Make status NOT NULL after setting values
ALTER TABLE projects 
ALTER COLUMN status SET NOT NULL;

-- Create an index on status for better query performance
CREATE INDEX idx_projects_status ON projects(status);

-- Create a function to automatically archive projects after 30 days
CREATE OR REPLACE FUNCTION auto_archive_old_projects()
RETURNS void AS $$
BEGIN
  UPDATE projects
  SET status = 'archived',
      archived_at = NOW()
  WHERE status = 'active'
    AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run auto-archive daily
-- Note: This requires pg_cron extension to be enabled in Supabase
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('archive-old-projects', '0 0 * * *', 'SELECT auto_archive_old_projects();');

-- Update RLS policies to handle archived projects
-- Drop existing select policy
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;

-- Create new select policy that respects archive status
CREATE POLICY "Enable read access for active projects and own archived projects" ON projects
FOR SELECT USING (
  status = 'active' 
  OR (status = 'archived' AND auth.uid() = user_id)
);

-- Other policies remain the same as they already check user_id