# Portfolio Admin API

Backend API for managing portfolio content (projects, experiences, blogs) with Supabase integration.

## Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase_schema.sql` in your Supabase SQL editor
   - Get your project URL and service role key from Settings > API

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials and set a secure admin token

4. **Run the API:**
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

### Public Endpoints (No authentication)
- `GET /api/projects` - Get all published projects
- `GET /api/experiences` - Get all experiences
- `GET /api/blogs` - Get all published blog posts

### Admin Endpoints (Require Bearer token)
All admin endpoints require the `Authorization: Bearer <ADMIN_TOKEN>` header.

**Projects:**
- `GET /api/admin/projects` - Get all projects (including unpublished)
- `POST /api/admin/projects` - Create a new project
- `PUT /api/admin/projects/{id}` - Update a project
- `DELETE /api/admin/projects/{id}` - Delete a project

**Experiences:**
- `GET /api/admin/experiences` - Get all experiences
- `POST /api/admin/experiences` - Create a new experience
- `PUT /api/admin/experiences/{id}` - Update an experience
- `DELETE /api/admin/experiences/{id}` - Delete an experience

**Blogs:**
- `GET /api/admin/blogs` - Get all blog posts (including unpublished)
- `POST /api/admin/blogs` - Create a new blog post
- `PUT /api/admin/blogs/{id}` - Update a blog post
- `DELETE /api/admin/blogs/{id}` - Delete a blog post

## Authentication

The API uses a simple bearer token authentication. Set the `ADMIN_TOKEN` in your `.env` file and include it in requests:

```
Authorization: Bearer your-secret-admin-token-change-this
```

## Deployment

For production deployment:
1. Use environment variables for all secrets
2. Set up proper CORS origins
3. Consider using Supabase Auth for more secure authentication
4. Deploy to services like Railway, Render, or AWS

