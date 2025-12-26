# How to Update Projects with Tech Topics

This guide explains how to create and update projects with tech topic tagging in the admin panel.

## Prerequisites

1. **Backend API is running** (on `http://localhost:8000` or your API URL)
2. **Admin panel is running** (on `http://localhost:3001`)
3. **You're logged in** to the admin panel with your admin token
4. **Tech topics exist** in your database (see below)

## Step-by-Step Guide

### Step 1: Ensure Tech Topics Exist

Before you can tag projects, you need to have tech topics in your database. You can:

**Option A: Create via API** (if you have tech topic admin endpoints)
```bash
POST /api/admin/tech-topics
```

**Option B: Insert directly in Supabase**
Go to your Supabase dashboard → Table Editor → `tech_topics` → Insert Row

Example tech topic:
```json
{
  "title": "Computer Vision",
  "icon_name": "Globe",
  "short_desc": "Image Processing",
  "description": "Real-time video analysis and pose estimation",
  "full_content": "Computer vision enables machines to interpret...",
  "color": "from-primary to-primary/70",
  "technologies": ["OpenCV", "DINO", "SAM 2"],
  "display_order": 0
}
```

### Step 2: Access the Projects Page

1. Open the admin panel: `http://localhost:3001`
2. Click on **"Projects"** in the navigation menu
3. You'll see a list of all your projects

### Step 3: Create a New Project

1. Click the **"Add Project"** button (top right)
2. Fill in the project details:
   - **Title**: Project name
   - **Role**: Your role in the project
   - **Year**: Project year
   - **Category**: Select from dropdown (Web, 3D, Experiments, Client)
   - **Description**: Brief description
   - **Tech Stack**: Comma-separated list (e.g., "React, TypeScript, Node.js")
   - **GitHub URL**: (Optional) Link to GitHub repository
   - **Live URL**: (Optional) Link to live demo
   - **Image URL**: (Optional) Project image

3. **Scroll down to "Tech Topics" section**
4. **Check the boxes** for the tech topics you want to tag this project to
   - You can select multiple tech topics
   - Each checked topic means this project will appear when users click that topic on the explore page

5. Click **"Create"** to save

### Step 4: Update an Existing Project

1. In the Projects list, find the project you want to update
2. Click the **Edit icon** (pencil icon) next to the project
3. The project form will open with all current data
4. **Modify any fields** you want to change
5. **Update tech topic selections**:
   - Check/uncheck tech topics as needed
   - The selected topics will be saved when you update

6. Click **"Update"** to save changes

### Step 5: Verify the Update

After saving:
- The project list will refresh automatically
- Your project is now tagged to the selected tech topics
- When users click those tech topics on the explore page, they'll see your project

## Example Workflow

**Scenario**: You want to tag a "Computer Vision" project to the "Computer Vision" and "Machine Learning" tech topics.

1. **Create/Edit Project**:
   - Title: "Exercise Monitoring System"
   - Category: "Experiments"
   - Description: "Real-time pose estimation system..."
   - Tech Stack: "OpenCV, Pose Estimation, DINO, SAM 2"

2. **Tag to Tech Topics**:
   - ✅ Check "Computer Vision"
   - ✅ Check "Machine Learning"
   - ❌ Leave others unchecked

3. **Save** the project

4. **Result**: 
   - The project is now linked to both tech topics
   - When users click "Computer Vision" or "Machine Learning" on the explore page, they'll see this project

## Troubleshooting

### "No tech topics available" message

**Problem**: The tech topics section shows "No tech topics available"

**Solution**: 
1. Make sure tech topics exist in your database
2. Check that the API is running and accessible
3. Verify your API URL in the admin panel `.env` file

### Tech topics not saving

**Problem**: You select tech topics but they don't save

**Solution**:
1. Check browser console for errors
2. Verify the API endpoint is working: `GET /api/admin/tech-topics`
3. Make sure you're logged in with a valid admin token
4. Check that the database schema includes the `project_tech_topics` table

### Projects not showing on explore page

**Problem**: Projects are tagged but don't appear on explore page

**Solution**:
1. Make sure the explore page is fetching from the API
2. Verify projects are published (`published: true`)
3. Check that the explore page is calling `/api/tech-topics/{topic_id}/projects`

## Quick Reference

- **Create Project**: Projects page → "Add Project" → Fill form → Select tech topics → Create
- **Update Project**: Projects page → Click Edit icon → Modify fields → Update tech topics → Update
- **Delete Project**: Projects page → Click Delete icon → Confirm

## API Endpoints Used

- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/{id}` - Update project
- `GET /api/admin/tech-topics` - List all tech topics
- `GET /api/tech-topics/{topic_id}/projects` - Get projects for a topic

## Tips

1. **Tag strategically**: Tag projects to relevant tech topics only
2. **Multiple tags**: A project can belong to multiple topics (e.g., a project using both AI and Web technologies)
3. **Keep it organized**: Use consistent tech topic names
4. **Test regularly**: After tagging, verify projects appear correctly on the explore page

