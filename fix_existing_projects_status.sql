-- Fix existing projects that don't have a status
UPDATE projects 
SET status = 'active' 
WHERE status IS NULL;

-- Make status NOT NULL now that all rows have values
ALTER TABLE projects 
ALTER COLUMN status SET NOT NULL;