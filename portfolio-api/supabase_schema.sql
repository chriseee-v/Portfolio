-- Portfolio Admin Database Schema for Supabase

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    role TEXT NOT NULL,
    year TEXT NOT NULL,
    stack TEXT[] NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id BIGSERIAL PRIMARY KEY,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT[] NOT NULL,
    highlight BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    read_time TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    summary TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tech Topics table (for explore page)
CREATE TABLE IF NOT EXISTS tech_topics (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    icon_name TEXT NOT NULL,  -- e.g., "Globe", "Cpu", etc. (lucide-react icon names)
    short_desc TEXT NOT NULL,
    description TEXT NOT NULL,
    full_content TEXT NOT NULL,
    color TEXT NOT NULL,  -- Tailwind gradient classes like "from-primary to-primary/70"
    technologies TEXT[] NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for projects and tech topics (many-to-many)
CREATE TABLE IF NOT EXISTS project_tech_topics (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tech_topic_id BIGINT NOT NULL REFERENCES tech_topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, tech_topic_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(year);
CREATE INDEX IF NOT EXISTS idx_experiences_year ON experiences(year);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date);
CREATE INDEX IF NOT EXISTS idx_tech_topics_order ON tech_topics(display_order);
CREATE INDEX IF NOT EXISTS idx_project_tech_topics_project ON project_tech_topics(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tech_topics_topic ON project_tech_topics(tech_topic_id);

-- Enable Row Level Security (RLS) - public read, admin write
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tech_topics ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read published projects" ON projects
    FOR SELECT USING (published = true);

CREATE POLICY "Public can read all experiences" ON experiences
    FOR SELECT USING (true);

CREATE POLICY "Public can read published blogs" ON blogs
    FOR SELECT USING (published = true);

CREATE POLICY "Public can read tech topics" ON tech_topics
    FOR SELECT USING (true);

CREATE POLICY "Public can read project tech topics" ON project_tech_topics
    FOR SELECT USING (true);

-- Note: Admin write operations will be handled through the API with service role key
-- which bypasses RLS. For additional security, you can create service role policies.

