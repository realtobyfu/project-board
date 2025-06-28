-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_method TEXT CHECK (contact_method IN ('email', 'phone', 'discord')),
  contact_info TEXT
);

-- Create skills table to track available skills
CREATE TABLE IF NOT EXISTS public.skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Insert some common skills
INSERT INTO public.skills (name) VALUES
  ('React'),
  ('TypeScript'),
  ('JavaScript'),
  ('Node.js'),
  ('Python'),
  ('Java'),
  ('C++'),
  ('C#'),
  ('Ruby'),
  ('Go'),
  ('SQL'),
  ('NoSQL'),
  ('GraphQL'),
  ('REST API'),
  ('Docker'),
  ('AWS'),
  ('Azure'),
  ('GCP'),
  ('Machine Learning'),
  ('AI'),
  ('Data Science')
ON CONFLICT (name) DO NOTHING;

-- Create row level security (RLS) policies
-- Enable RLS on the projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see all projects (public read)
CREATE POLICY "Public read access for projects" ON public.projects
  FOR SELECT
  USING (true);

-- Create policy to allow users to create their own projects
CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own projects
CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own projects
CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on the skills table
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see all skills (public read)
CREATE POLICY "Public read access for skills" ON public.skills
  FOR SELECT
  USING (true);

-- Create function to update the updated_at field
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at field when a project is updated
CREATE OR REPLACE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at(); 