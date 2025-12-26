# Portfolio Admin System Setup Guide

This guide will help you set up the complete admin system for managing your portfolio content.

## Architecture

- **Backend API**: FastAPI server with Supabase integration (`portfolio-api/`)
- **Admin Panel**: React admin interface (`portfolio-admin/`)
- **Portfolio**: Your main portfolio site (`the-lab-interface/`)

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to the SQL Editor
3. Run the SQL schema from `portfolio-api/supabase_schema.sql`
4. Go to Settings > API and copy:
   - Project URL
   - Service Role Key (keep this secret!)

## Step 2: Set Up Backend API

1. Navigate to the API directory:
```bash
cd portfolio-api
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_TOKEN=your-secret-admin-token-change-this
```

5. Run the API server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## Step 3: Set Up Admin Panel

1. Navigate to the admin directory:
```bash
cd portfolio-admin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and set your API URL:
```
VITE_API_URL=http://localhost:8000
```

5. Run the admin panel:
```bash
npm run dev
```

The admin panel will be available at `http://localhost:3001`

6. Login with your admin token (the `ADMIN_TOKEN` from the backend `.env`)

## Step 4: Update Portfolio to Use API

1. Navigate to your portfolio:
```bash
cd the-lab-interface
```

2. Create a `.env` file (or `.env.local`):
```
VITE_API_URL=http://localhost:8000
```

3. Install dependencies (if not already done):
```bash
npm install
```

4. Run the portfolio:
```bash
npm run dev
```

The portfolio will now fetch data from your API!

## Step 5: Add Initial Data

1. Open the admin panel at `http://localhost:3001`
2. Login with your admin token
3. Add your projects, experiences, and blog posts through the admin interface
4. The portfolio will automatically display the new content

## Deployment

### Backend API

Deploy to services like:
- **Railway**: Easy deployment with environment variables
- **Render**: Free tier available
- **AWS/GCP**: For production scale

Set environment variables in your hosting platform:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`

### Admin Panel

Deploy to:
- **Vercel**: Connect your GitHub repo
- **Netlify**: Drag and drop or Git integration
- **GitHub Pages**: For static hosting

Set environment variable:
- `VITE_API_URL`: Your production API URL

### Portfolio

Deploy the same way as the admin panel, and set:
- `VITE_API_URL`: Your production API URL

## Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Change the default ADMIN_TOKEN** - Use a strong, random token
3. **In production**, restrict CORS origins in the API to only your frontend domains
4. **Consider using Supabase Auth** for more secure authentication instead of simple tokens

## Troubleshooting

### API not connecting
- Check that the API server is running
- Verify Supabase credentials are correct
- Check CORS settings if accessing from different origin

### Admin panel can't login
- Verify the `ADMIN_TOKEN` matches in both backend `.env` and what you're entering
- Check browser console for errors

### Portfolio shows no data
- Verify the API is running and accessible
- Check browser console for API errors
- Ensure `VITE_API_URL` is set correctly

## Next Steps

1. Add more content through the admin panel
2. Customize the admin panel UI if needed
3. Set up automated deployments
4. Consider adding image upload functionality to Supabase Storage
5. Add more content types (testimonials, skills, etc.)

## Support

For issues or questions:
- Check the API logs for backend errors
- Check browser console for frontend errors
- Verify all environment variables are set correctly

