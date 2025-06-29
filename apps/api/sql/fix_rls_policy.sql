-- Drop the restrictive policy
DROP POLICY IF EXISTS "Enable read access for active projects and own archived projects" ON projects;

-- Create a more permissive policy that handles projects with or without status
CREATE POLICY "Enable read access for all users" ON projects
FOR SELECT USING (
  true
);

-- Or if you want to keep the archive logic but be more permissive:
-- CREATE POLICY "Enable read access for projects" ON projects
-- FOR SELECT USING (
--   (status IS NULL OR status = 'active') 
--   OR (status = 'archived' AND auth.uid() = user_id)
-- );