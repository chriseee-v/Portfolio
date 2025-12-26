# Project Tagging to Tech Topics Guide

This guide explains how to tag projects to tech topic categories on the explore page.

## Overview

Projects can now be tagged to one or more tech topics (like "Computer Vision", "RAG Systems", etc.) that appear on the explore page. When a user clicks on a tech topic card, they'll see all projects tagged to that topic.

## Database Structure

1. **tech_topics** table: Stores the tech topic cards (Computer Vision, RAG Systems, etc.)
2. **project_tech_topics** junction table: Links projects to tech topics (many-to-many relationship)

## Setup Steps

### 1. Run the Updated Database Schema

In your Supabase SQL Editor, run the updated schema from `portfolio-api/supabase_schema.sql`. This will create:
- `tech_topics` table
- `project_tech_topics` junction table

### 2. Create Tech Topics

You can create tech topics through the API or directly in Supabase. Each tech topic needs:
- `title`: e.g., "Computer Vision"
- `icon_name`: Lucide React icon name (e.g., "Globe", "Cpu")
- `short_desc`: Short description shown on card front
- `description`: Description shown in modal
- `full_content`: Full content shown in expanded view
- `color`: Tailwind gradient classes (e.g., "from-primary to-primary/70")
- `technologies`: Array of technology names
- `display_order`: Order for display (0, 1, 2, etc.)

### 3. Tag Projects to Tech Topics

When creating or editing a project in the admin panel:

1. Open the project form
2. Scroll to the "Tech Topics" section at the bottom
3. Check the boxes for the tech topics you want to tag this project to
4. Save the project

A project can be tagged to multiple tech topics.

## API Endpoints

### Public Endpoints

- `GET /api/tech-topics` - Get all tech topics
- `GET /api/tech-topics/{topic_id}/projects` - Get all projects for a specific tech topic

### Admin Endpoints

- `GET /api/admin/tech-topics` - Get all tech topics
- `POST /api/admin/tech-topics` - Create a tech topic
- `PUT /api/admin/tech-topics/{id}` - Update a tech topic
- `DELETE /api/admin/tech-topics/{id}` - Delete a tech topic

## Using in Your Portfolio

### Fetch Projects by Topic

When a user clicks on a tech topic card in the explore page, you can fetch related projects:

```typescript
const projects = await fetch(`/api/tech-topics/${topicId}/projects`)
```

### Example: Update Explore Page

You can update the explore page to:
1. Fetch tech topics from the API instead of hardcoded data
2. Show related projects when a card is clicked
3. Link to the projects page filtered by that topic

## Admin Panel Usage

1. **Creating a Project:**
   - Fill in project details
   - Scroll to "Tech Topics" section
   - Select one or more tech topics
   - Save

2. **Editing a Project:**
   - Open the project
   - Modify tech topic selections
   - Save (relationships will be updated)

3. **Viewing Tagged Projects:**
   - Projects are automatically linked to selected tech topics
   - The relationship is stored in the `project_tech_topics` table

## Example Tech Topic Data

Here's an example of what a tech topic looks like:

```json
{
  "id": 1,
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

## Next Steps

1. Create tech topics in your database (you can use the existing hardcoded data as reference)
2. Tag your existing projects to relevant tech topics
3. Update the explore page to fetch tech topics from the API
4. Add functionality to show related projects when clicking a tech topic card

## Notes

- Projects can belong to multiple tech topics
- Tech topics can have multiple projects
- Deleting a project will automatically remove its tech topic relationships
- Deleting a tech topic will remove all project relationships

