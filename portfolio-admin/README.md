# Portfolio Admin Panel

Admin interface for managing portfolio content (projects, experiences, blogs).

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
   - Create a `.env` file in the root directory
   - Add your API URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```

3. **Run the development server:**
```bash
npm run dev
```

The admin panel will be available at `http://localhost:3001`

## Usage

1. **Login:**
   - Enter your admin token (set in the backend API `.env` file)
   - The token is stored in localStorage for convenience

2. **Manage Content:**
   - **Projects**: Add, edit, and delete portfolio projects
   - **Experiences**: Manage your work experience timeline
   - **Blogs**: Create and manage blog posts

3. **Features:**
   - Full CRUD operations for all content types
   - Real-time updates
   - Responsive design
   - Simple token-based authentication

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## Deployment

You can deploy the admin panel to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Make sure to set the `VITE_API_URL` environment variable to point to your production API URL.

