# Resume Parser Guide

This guide explains how to use the "Populate via Resume" feature to automatically extract and populate your portfolio data from a PDF resume.

## Overview

The Resume Parser feature allows you to:
1. Upload your resume PDF
2. Automatically extract projects, experiences, and skills
3. Preview the extracted data
4. Populate your database with one click

## Setup

### 1. Install Dependencies

Make sure you have the required Python packages:

```bash
cd portfolio-api
pip install -r requirements.txt
```

This will install:
- `pdfplumber` - For extracting text from PDFs
- `PyPDF2` - Alternative PDF parser
- `openai` - For AI-powered parsing (optional but recommended)

### 2. Configure OpenAI (Optional but Recommended)

For best results, add your OpenAI API key to the backend `.env` file:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

**Why use OpenAI?**
- More accurate extraction of structured data
- Better understanding of context
- Handles various resume formats
- Falls back to rule-based parsing if not available

**Without OpenAI:**
- Uses rule-based parsing
- Less accurate but still functional
- May miss some projects/experiences

### 3. Start the Backend API

```bash
cd portfolio-api
python main.py
```

## How to Use

### Step 1: Access the Resume Parser

1. Open your admin panel: `http://localhost:3001`
2. Log in with your admin token
3. Click **"Populate via Resume"** in the navigation menu
   - Or click the card on the Dashboard

### Step 2: Upload Your Resume

1. Click the upload area or drag and drop your resume PDF
2. Select your resume file (must be PDF format)
3. The file name will appear once selected

### Step 3: Parse the Resume

1. Click **"Parse Resume"** button
2. Wait for parsing to complete (may take 10-30 seconds)
3. Review the parsed data preview:
   - Summary showing counts
   - Projects list with details
   - Experiences list with details
   - Skills extracted

### Step 4: Populate Database

You have two options:

**Option A: Skip Existing (Recommended)**
- Click **"Populate Database (Skip Existing)"**
- Only creates new entries
- Won't overwrite existing projects/experiences
- Safe for first-time use

**Option B: Overwrite**
- Click **"Populate Database (Overwrite)"**
- Creates new entries and updates existing ones
- Use when you want to update existing data
- Be careful - this may modify existing entries

### Step 5: Verify

1. Go to **Projects** page to see created projects
2. Go to **Experiences** page to see created experiences
3. Edit any entries if needed

## What Gets Extracted

### Projects
- **Title**: Project name
- **Role**: Your role in the project
- **Year**: Project year
- **Stack**: Technologies used (array)
- **Category**: Auto-categorized (Web, Experiments, Client, 3D)
- **Description**: Project description

### Experiences
- **Year**: Employment/education year
- **Title**: Job title or degree
- **Company**: Company name or institution
- **Description**: Role description
- **Technologies**: Technologies used (array)
- **Highlight**: Whether to highlight (based on context)

### Skills
- List of all technologies mentioned in the resume

## Tips for Best Results

1. **Use a well-formatted resume**
   - Clear sections (Projects, Experience, Education)
   - Consistent formatting
   - Proper dates and company names

2. **Include detailed descriptions**
   - More context = better extraction
   - Include technologies used
   - Mention your role/responsibilities

3. **Review before populating**
   - Always check the preview
   - Edit entries manually if needed
   - Verify categories are correct

4. **Use OpenAI for better accuracy**
   - Sign up at [openai.com](https://openai.com)
   - Get an API key
   - Add to your `.env` file

## Troubleshooting

### "Error parsing resume"
- **Check**: Is the file a valid PDF?
- **Check**: Is the PDF not password-protected?
- **Check**: Does the PDF contain readable text (not just images)?

### "No projects/experiences extracted"
- **Try**: Using OpenAI API key for better parsing
- **Check**: Resume format - ensure clear sections
- **Try**: Manually adding entries if parsing fails

### "Failed to populate database"
- **Check**: Backend API is running
- **Check**: Database connection is working
- **Check**: Admin token is valid
- **Check**: Required fields are present in extracted data

### Parsing is inaccurate
- **Solution**: Use OpenAI API key
- **Solution**: Improve resume formatting
- **Solution**: Manually edit entries after populating

## Manual Review Recommended

Even with AI parsing, it's recommended to:
1. Review all extracted data
2. Edit entries for accuracy
3. Add missing information
4. Tag projects to tech topics
5. Add images/links manually

## API Endpoints

- `POST /api/admin/parse-resume` - Parse resume and return structured data
- `POST /api/admin/populate-from-resume` - Parse and populate database

Both endpoints require admin authentication.

## Next Steps

After populating:
1. Review and edit entries in Projects/Experiences pages
2. Tag projects to tech topics
3. Add images, GitHub links, live URLs
4. Publish/unpublish as needed
5. Your portfolio will automatically update!

