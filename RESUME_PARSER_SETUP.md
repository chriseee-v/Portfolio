# Resume Parser - Quick Setup

## Backend Setup

1. **Install dependencies:**
```bash
cd portfolio-api
pip install -r requirements.txt
```

2. **Add OpenAI API key (optional but recommended):**
Add to `portfolio-api/.env`:
```
OPENAI_API_KEY=your-openai-api-key-here
```

3. **Start the API:**
```bash
python main.py
```

## Using the Feature

1. **Open Admin Panel**: `http://localhost:3001`
2. **Navigate to**: "Populate via Resume" in the menu
3. **Upload**: Your resume PDF file
4. **Parse**: Click "Parse Resume" to extract data
5. **Review**: Check the preview of extracted data
6. **Populate**: Click "Populate Database" to save to database

## Features

- ✅ Extracts projects from resume
- ✅ Extracts work experiences
- ✅ Extracts skills/technologies
- ✅ Auto-categorizes projects
- ✅ Preview before populating
- ✅ Skip existing or overwrite options
- ✅ AI-powered parsing (with OpenAI)
- ✅ Rule-based fallback (without OpenAI)

## What You Need

- Resume in PDF format
- Admin token (for authentication)
- OpenAI API key (optional, for better accuracy)

See `RESUME_PARSER_GUIDE.md` for detailed instructions.

