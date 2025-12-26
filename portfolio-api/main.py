from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import tempfile
from resume_parser import extract_text_from_pdf, parse_resume_with_ai, categorize_project

load_dotenv()

app = FastAPI(title="Portfolio Admin API", version="1.0.0")

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Service role key for admin operations
supabase: Client = create_client(supabase_url, supabase_key)

# Security
security = HTTPBearer()

# Admin token (in production, use proper JWT authentication)
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "your-secret-admin-token-change-this")

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )
    return credentials.credentials

# Pydantic Models
class ProjectCreate(BaseModel):
    title: str
    role: str
    year: str
    stack: List[str]
    category: str
    description: str
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    tech_topic_ids: Optional[List[int]] = []  # IDs of tech topics to tag this project to

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    role: Optional[str] = None
    year: Optional[str] = None
    stack: Optional[List[str]] = None
    category: Optional[str] = None
    description: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    tech_topic_ids: Optional[List[int]] = None

class ExperienceCreate(BaseModel):
    year: str
    title: str
    company: str
    description: str
    technologies: List[str]
    highlight: bool = False

class ExperienceUpdate(BaseModel):
    year: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    highlight: Optional[bool] = None

class BlogCreate(BaseModel):
    title: str
    date: str
    read_time: str
    tags: List[str]
    summary: str
    content: Optional[str] = None
    image_url: Optional[str] = None

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    read_time: Optional[str] = None
    tags: Optional[List[str]] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None

class TechTopicCreate(BaseModel):
    title: str
    icon_name: str
    short_desc: str
    description: str
    full_content: str
    color: str
    technologies: List[str]
    display_order: int = 0

class TechTopicUpdate(BaseModel):
    title: Optional[str] = None
    icon_name: Optional[str] = None
    short_desc: Optional[str] = None
    description: Optional[str] = None
    full_content: Optional[str] = None
    color: Optional[str] = None
    technologies: Optional[List[str]] = None
    display_order: Optional[int] = None

# Public endpoints (no authentication required)
@app.get("/")
async def root():
    return {"message": "Portfolio API", "version": "1.0.0"}

@app.get("/api/projects")
async def get_projects():
    """Get all published projects with tech topic IDs"""
    try:
        response = supabase.table("projects").select("*").eq("published", True).order("year", desc=True).execute()
        projects = response.data
        
        # Fetch tech topic relationships for each project
        for project in projects:
            links_response = supabase.table("project_tech_topics").select("tech_topic_id").eq("project_id", project["id"]).execute()
            project["tech_topic_ids"] = [link["tech_topic_id"] for link in links_response.data]
        
        return {"data": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/experiences")
async def get_experiences():
    """Get all experiences"""
    try:
        response = supabase.table("experiences").select("*").order("year", desc=True).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blogs")
async def get_blogs():
    """Get all published blog posts"""
    try:
        response = supabase.table("blogs").select("*").eq("published", True).order("date", desc=True).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tech-topics")
async def get_tech_topics():
    """Get all tech topics"""
    try:
        response = supabase.table("tech_topics").select("*").order("display_order", desc=False).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tech-topics/{topic_id}/projects")
async def get_projects_by_topic(topic_id: int):
    """Get all published projects for a specific tech topic"""
    try:
        # Get project IDs linked to this topic
        links_response = supabase.table("project_tech_topics").select("project_id").eq("tech_topic_id", topic_id).execute()
        project_ids = [link["project_id"] for link in links_response.data]
        
        if not project_ids:
            return {"data": []}
        
        # Get the projects
        projects_response = supabase.table("projects").select("*").in_("id", project_ids).eq("published", True).order("year", desc=True).execute()
        return {"data": projects_response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Admin endpoints (require authentication)
@app.post("/api/admin/projects", dependencies=[Depends(verify_admin_token)])
async def create_project(project: ProjectCreate):
    """Create a new project"""
    try:
        data = project.dict()
        tech_topic_ids = data.pop("tech_topic_ids", [])
        data["published"] = True
        data["created_at"] = datetime.utcnow().isoformat()
        response = supabase.table("projects").insert(data).execute()
        project_id = response.data[0]["id"]
        
        # Create tech topic relationships
        if tech_topic_ids:
            relationships = [{"project_id": project_id, "tech_topic_id": topic_id} for topic_id in tech_topic_ids]
            supabase.table("project_tech_topics").insert(relationships).execute()
        
        return {"message": "Project created", "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/projects/{project_id}", dependencies=[Depends(verify_admin_token)])
async def update_project(project_id: int, project: ProjectUpdate):
    """Update a project"""
    try:
        data = {k: v for k, v in project.dict().items() if v is not None}
        tech_topic_ids = data.pop("tech_topic_ids", None)
        data["updated_at"] = datetime.utcnow().isoformat()
        response = supabase.table("projects").update(data).eq("id", project_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Update tech topic relationships if provided
        if tech_topic_ids is not None:
            # Delete existing relationships
            supabase.table("project_tech_topics").delete().eq("project_id", project_id).execute()
            # Create new relationships
            if tech_topic_ids:
                relationships = [{"project_id": project_id, "tech_topic_id": topic_id} for topic_id in tech_topic_ids]
                supabase.table("project_tech_topics").insert(relationships).execute()
        
        return {"message": "Project updated", "data": response.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/projects/{project_id}", dependencies=[Depends(verify_admin_token)])
async def delete_project(project_id: int):
    """Delete a project"""
    try:
        supabase.table("projects").delete().eq("id", project_id).execute()
        return {"message": "Project deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/projects", dependencies=[Depends(verify_admin_token)])
async def get_all_projects_admin():
    """Get all projects (including unpublished)"""
    try:
        response = supabase.table("projects").select("*").order("year", desc=True).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/experiences", dependencies=[Depends(verify_admin_token)])
async def create_experience(experience: ExperienceCreate):
    """Create a new experience"""
    try:
        data = experience.dict()
        data["created_at"] = datetime.utcnow().isoformat()
        response = supabase.table("experiences").insert(data).execute()
        return {"message": "Experience created", "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/experiences/{exp_id}", dependencies=[Depends(verify_admin_token)])
async def update_experience(exp_id: int, experience: ExperienceUpdate):
    """Update an experience"""
    try:
        data = {k: v for k, v in experience.dict().items() if v is not None}
        data["updated_at"] = datetime.utcnow().isoformat()
        response = supabase.table("experiences").update(data).eq("id", exp_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Experience not found")
        return {"message": "Experience updated", "data": response.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/experiences/{exp_id}", dependencies=[Depends(verify_admin_token)])
async def delete_experience(exp_id: int):
    """Delete an experience"""
    try:
        supabase.table("experiences").delete().eq("id", exp_id).execute()
        return {"message": "Experience deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/experiences", dependencies=[Depends(verify_admin_token)])
async def get_all_experiences_admin():
    """Get all experiences"""
    try:
        response = supabase.table("experiences").select("*").order("year", desc=True).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/blogs", dependencies=[Depends(verify_admin_token)])
async def create_blog(blog: BlogCreate):
    """Create a new blog post"""
    try:
        data = blog.dict()
        data["published"] = True
        data["created_at"] = datetime.utcnow().isoformat()
        response = supabase.table("blogs").insert(data).execute()
        return {"message": "Blog post created", "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/blogs/{blog_id}", dependencies=[Depends(verify_admin_token)])
async def update_blog(blog_id: int, blog: BlogUpdate):
    """Update a blog post"""
    try:
        data = {k: v for k, v in blog.dict().items() if v is not None}
        data["updated_at"] = datetime.utcnow().isoformat()
        response = supabase.table("blogs").update(data).eq("id", blog_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Blog post not found")
        return {"message": "Blog post updated", "data": response.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/blogs/{blog_id}", dependencies=[Depends(verify_admin_token)])
async def delete_blog(blog_id: int):
    """Delete a blog post"""
    try:
        supabase.table("blogs").delete().eq("id", blog_id).execute()
        return {"message": "Blog post deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/blogs", dependencies=[Depends(verify_admin_token)])
async def get_all_blogs_admin():
    """Get all blog posts (including unpublished)"""
    try:
        response = supabase.table("blogs").select("*").order("date", desc=True).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Tech Topics Admin Endpoints
@app.get("/api/admin/tech-topics", dependencies=[Depends(verify_admin_token)])
async def get_all_tech_topics_admin():
    """Get all tech topics"""
    try:
        response = supabase.table("tech_topics").select("*").order("display_order", desc=False).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/tech-topics", dependencies=[Depends(verify_admin_token)])
async def create_tech_topic(topic: TechTopicCreate):
    """Create a new tech topic"""
    try:
        data = topic.dict()
        data["created_at"] = datetime.utcnow().isoformat()
        response = supabase.table("tech_topics").insert(data).execute()
        return {"message": "Tech topic created", "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/tech-topics/{topic_id}", dependencies=[Depends(verify_admin_token)])
async def update_tech_topic(topic_id: int, topic: TechTopicUpdate):
    """Update a tech topic"""
    try:
        data = {k: v for k, v in topic.dict().items() if v is not None}
        data["updated_at"] = datetime.utcnow().isoformat()
        response = supabase.table("tech_topics").update(data).eq("id", topic_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Tech topic not found")
        return {"message": "Tech topic updated", "data": response.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/tech-topics/{topic_id}", dependencies=[Depends(verify_admin_token)])
async def delete_tech_topic(topic_id: int):
    """Delete a tech topic"""
    try:
        supabase.table("tech_topics").delete().eq("id", topic_id).execute()
        return {"message": "Tech topic deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Resume Parsing Endpoint
@app.post("/api/admin/parse-resume", dependencies=[Depends(verify_admin_token)])
async def parse_resume(file: UploadFile = File(...)):
    """Parse resume PDF and extract projects, experiences, and skills"""
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        try:
            # Extract text from PDF
            text = extract_text_from_pdf(tmp_path)
            
            # Parse resume (with AI if OpenAI key is available)
            openai_key = os.getenv("OPENAI_API_KEY")
            parsed_data = parse_resume_with_ai(text, openai_key)
            
            # Process and return structured data
            result = {
                "projects": [],
                "experiences": [],
                "skills": parsed_data.get("skills", [])
            }
            
            # Process projects
            for project in parsed_data.get("projects", []):
                if not project.get("category"):
                    project["category"] = categorize_project(
                        project.get("title", ""),
                        project.get("description", ""),
                        project.get("stack", [])
                    )
                result["projects"].append(project)
            
            # Process experiences
            result["experiences"] = parsed_data.get("experiences", [])
            
            return {
                "message": "Resume parsed successfully",
                "data": result,
                "summary": {
                    "projects_count": len(result["projects"]),
                    "experiences_count": len(result["experiences"]),
                    "skills_count": len(result["skills"])
                }
            }
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@app.post("/api/admin/populate-from-resume", dependencies=[Depends(verify_admin_token)])
async def populate_from_resume(
    file: UploadFile = File(...),
    overwrite: bool = Form(False)
):
    """Parse resume and automatically populate database"""
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        try:
            # Extract text from PDF
            text = extract_text_from_pdf(tmp_path)
            
            # Parse resume
            openai_key = os.getenv("OPENAI_API_KEY")
            parsed_data = parse_resume_with_ai(text, openai_key)
            
            # Process projects
            data = {
                "projects": [],
                "experiences": parsed_data.get("experiences", [])
            }
            
            for project in parsed_data.get("projects", []):
                if not project.get("category"):
                    project["category"] = categorize_project(
                        project.get("title", ""),
                        project.get("description", ""),
                        project.get("stack", [])
                    )
                data["projects"].append(project)
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        
        created_projects = []
        created_experiences = []
        errors = []
        
        # Create projects
        for project in data.get("projects", []):
            try:
                project_data = {
                    "title": project.get("title", "Untitled Project"),
                    "role": project.get("role", "Developer"),
                    "year": project.get("year", str(datetime.now().year)),
                    "stack": project.get("stack", []),
                    "category": project.get("category", "Web"),
                    "description": project.get("description", ""),
                    "published": True
                }
                
                # Check if project already exists (by title)
                if not overwrite:
                    existing = supabase.table("projects").select("id").eq("title", project_data["title"]).execute()
                    if existing.data:
                        continue
                
                response = supabase.table("projects").insert(project_data).execute()
                created_projects.append(response.data[0])
            except Exception as e:
                errors.append(f"Error creating project {project.get('title')}: {str(e)}")
        
        # Create experiences
        for exp in data.get("experiences", []):
            try:
                exp_data = {
                    "year": exp.get("year", str(datetime.now().year)),
                    "title": exp.get("title", "Position"),
                    "company": exp.get("company", "Company"),
                    "description": exp.get("description", ""),
                    "technologies": exp.get("technologies", []),
                    "highlight": exp.get("highlight", False)
                }
                
                # Check if experience already exists
                if not overwrite:
                    existing = supabase.table("experiences").select("id").eq("title", exp_data["title"]).eq("company", exp_data["company"]).execute()
                    if existing.data:
                        continue
                
                response = supabase.table("experiences").insert(exp_data).execute()
                created_experiences.append(response.data[0])
            except Exception as e:
                errors.append(f"Error creating experience {exp.get('title')}: {str(e)}")
        
        return {
            "message": "Database populated from resume",
            "created": {
                "projects": len(created_projects),
                "experiences": len(created_experiences)
            },
            "errors": errors
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error populating from resume: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

