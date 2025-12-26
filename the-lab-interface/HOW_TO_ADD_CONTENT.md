# How to Add Content to Your Portfolio

This guide explains how to easily add new projects, blog posts, and experiences to your portfolio without touching any component code.

## 📁 File Structure

All content is stored in JSON files in the `src/data/` directory:
- `projects.json` - Your projects
- `blogs.json` - Your blog posts
- `experiences.json` - Your work experience and education timeline

## 🚀 Adding a New Project

1. Open `src/data/projects.json`
2. Add a new project object to the array:

```json
{
  "id": 7,
  "title": "Your Project Name",
  "role": "Your Role (e.g., Full Stack Developer)",
  "year": "2025",
  "stack": ["React", "TypeScript", "Node.js"],
  "category": "Web",
  "description": "A brief description of your project and its impact.",
  "url": "https://your-project-url.com",
  "github": "https://github.com/yourusername/project"
}
```

**Fields:**
- `id`: Unique number (use the next available number)
- `title`: Project name
- `role`: Your role in the project
- `year`: Year completed
- `stack`: Array of technologies used
- `category`: One of "Web", "3D", "Experiments", or "Client"
- `description`: Brief description (1-2 sentences)
- `url`: (Optional) Live project URL
- `github`: (Optional) GitHub repository URL

**Categories:** Projects are filtered by category. Available categories: "All", "Web", "3D", "Experiments", "Client"

## ✍️ Adding a New Blog Post

1. Open `src/data/blogs.json`
2. Add a new blog post object:

```json
{
  "id": 6,
  "title": "Your Blog Post Title",
  "date": "Jan 15, 2025",
  "readTime": "5 min",
  "tags": ["React", "TypeScript"],
  "summary": "A brief summary of what the article covers.",
  "url": "https://your-blog-url.com/article"
}
```

**Fields:**
- `id`: Unique number
- `title`: Blog post title
- `date`: Publication date (format: "MMM DD, YYYY")
- `readTime`: Estimated reading time
- `tags`: Array of relevant tags
- `summary`: Brief summary (1-2 sentences)
- `url`: (Optional) Link to full article

## 💼 Adding a New Experience

1. Open `src/data/experiences.json`
2. Add a new experience object:

```json
{
  "year": "2025",
  "title": "Your Job Title",
  "company": "Company Name",
  "description": "What you did and achieved in this role.",
  "technologies": ["Python", "React", "AWS"],
  "highlight": true
}
```

**Fields:**
- `year`: Year or date range (e.g., "2025" or "2023-2025")
- `title`: Job title or degree
- `company`: Company or institution name
- `description`: What you accomplished (1-2 sentences)
- `technologies`: Array of technologies/skills used
- `highlight`: `true` for important roles (adds visual emphasis)

**Note:** Experiences are displayed in chronological order on the timeline page.

## 📝 Tips

1. **IDs**: Always use unique, sequential IDs. Check the last ID in the file and increment by 1.

2. **Ordering**: 
   - Projects: Order doesn't matter (they can be filtered)
   - Blogs: Displayed in the order they appear in the JSON file
   - Experiences: Displayed chronologically (newest first)

3. **URLs**: Leave `url` and `github` fields as empty strings (`""`) if you don't have links yet.

4. **Categories**: When adding a new project category, you'll need to update the `filters` array in `src/pages/ProjectsPage.tsx`.

5. **Validation**: Make sure your JSON is valid (no trailing commas, proper quotes, etc.)

## 🔄 After Adding Content

1. Save the JSON file
2. The changes will automatically appear on your portfolio
3. No need to restart the dev server - hot reload will pick up the changes

## 📚 Example: Complete Project Entry

```json
{
  "id": 7,
  "title": "E-Commerce Platform",
  "role": "Full Stack Developer",
  "year": "2025",
  "stack": ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
  "category": "Web",
  "description": "Built a scalable e-commerce platform handling 10,000+ daily transactions. Implemented real-time inventory management and reduced checkout time by 40%.",
  "url": "https://example-store.com",
  "github": "https://github.com/username/ecommerce"
}
```

That's it! Just edit the JSON files and your portfolio updates automatically. 🎉

