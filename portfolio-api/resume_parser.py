"""
Resume Parser - Extracts structured data from PDF resumes
"""
import pdfplumber
import re
from typing import Dict, List, Any, Optional
import json

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF file"""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")
    return text

def parse_resume_with_ai(text: str, openai_api_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Parse resume text using AI to extract structured data.
    Falls back to rule-based parsing if OpenAI key is not provided.
    """
    if openai_api_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_api_key)
            
            prompt = f"""Extract structured data from this resume text and return ONLY valid JSON. 
            Extract:
            1. Projects: title, role, year, stack (array), category, description
            2. Experiences: year, title, company, description, technologies (array), highlight (boolean)
            3. Skills/Technologies: list of all technologies mentioned
            
            Resume text:
            {text[:4000]}  # Limit to avoid token limits
            
            Return JSON format:
            {{
                "projects": [
                    {{
                        "title": "Project Name",
                        "role": "Role in project",
                        "year": "2024",
                        "stack": ["Tech1", "Tech2"],
                        "category": "Web|Experiments|Client|3D",
                        "description": "Brief description"
                    }}
                ],
                "experiences": [
                    {{
                        "year": "2024",
                        "title": "Job Title",
                        "company": "Company Name",
                        "description": "Job description",
                        "technologies": ["Tech1", "Tech2"],
                        "highlight": true
                    }}
                ],
                "skills": ["Technology1", "Technology2"]
            }}
            """
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a resume parser. Extract structured data and return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1
            )
            
            result_text = response.choices[0].message.content.strip()
            # Remove markdown code blocks if present
            if result_text.startswith("```"):
                result_text = re.sub(r'^```json\n?', '', result_text)
                result_text = re.sub(r'\n?```$', '', result_text)
            
            return json.loads(result_text)
        except Exception as e:
            print(f"AI parsing failed, falling back to rule-based: {e}")
            return parse_resume_rule_based(text)
    else:
        return parse_resume_rule_based(text)

def parse_resume_rule_based(text: str) -> Dict[str, Any]:
    """
    Rule-based resume parser as fallback
    """
    projects = []
    experiences = []
    skills = set()
    
    # Normalize text
    text = text.replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text)
    
    # Extract projects (look for common project indicators)
    project_patterns = [
        r'(?:Project|Built|Developed|Created|Designed)[\s:]+([A-Z][^.!?]{10,200})',
        r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:project|system|application|platform|tool)',
    ]
    
    # Extract experiences (look for job titles and companies)
    experience_patterns = [
        r'(\d{4}(?:-\d{4})?)\s+([A-Z][^.!?]{5,100})\s+at\s+([A-Z][^.!?]{5,100})',
        r'([A-Z][^.!?]{5,100})\s+([A-Z][^.!?]{5,100})\s+(\d{4})',
    ]
    
    # Extract technologies (common tech keywords)
    tech_keywords = [
        'Python', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js',
        'FastAPI', 'Flask', 'Django', 'Express', 'MongoDB', 'PostgreSQL', 'MySQL',
        'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub',
        'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'LangChain', 'ChromaDB',
        'Arduino', 'Raspberry Pi', 'IoT', 'Machine Learning', 'AI', 'Computer Vision',
        'WebSocket', 'REST API', 'GraphQL', 'Microservices', 'CI/CD'
    ]
    
    for keyword in tech_keywords:
        if keyword.lower() in text.lower():
            skills.add(keyword)
    
    return {
        "projects": projects,
        "experiences": experiences,
        "skills": list(skills)
    }

def categorize_project(title: str, description: str, stack: List[str]) -> str:
    """Categorize project based on title, description, and tech stack"""
    title_lower = title.lower()
    desc_lower = description.lower()
    stack_lower = [s.lower() for s in stack]
    
    # Check for 3D projects
    if any(term in title_lower or term in desc_lower for term in ['3d', 'three.js', 'webgl', 'blender', 'unity']):
        return "3D"
    
    # Check for client work
    if any(term in title_lower or term in desc_lower for term in ['client', 'freelance', 'consulting', 'contract']):
        return "Client"
    
    # Check for experiments
    if any(term in title_lower or term in desc_lower for term in ['experiment', 'prototype', 'proof of concept', 'poc', 'research']):
        return "Experiments"
    
    # Default to Web
    return "Web"

