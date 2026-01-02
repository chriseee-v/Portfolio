# Local Development Setup

## Running the Application Locally

This portfolio uses Vercel serverless functions for API routes. To run locally, you need **two servers**:

### 1. Vercel Dev Server (for API routes)

The API routes (`/api/*`) are Vercel serverless functions. Run:

```bash
npx vercel dev
```

This starts the API server on `http://localhost:3000`

### 2. Vite Dev Server (for frontend)

In a **separate terminal**, run:

```bash
npm run dev
```

This starts the frontend on `http://localhost:8080`

### How They Work Together

The Vite config includes a proxy that automatically forwards `/api/*` requests to the Vercel dev server:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

So when your frontend makes a request to `/api/subscribe`, it's automatically forwarded to `http://localhost:3000/api/subscribe`.

## Quick Start

```bash
# Terminal 1: Start API server
npx vercel dev

# Terminal 2: Start frontend
npm run dev

# Terminal 3: Run tests (optional)
npm run test:email -- --email your-email@example.com
```

## Troubleshooting

### "Failed to fetch" or "Network error"
- Make sure `vercel dev` is running in a separate terminal
- Check that port 3000 is not already in use
- Verify the proxy is working by checking the Vite console

### "API endpoint not found"
- Ensure you're running `vercel dev` (not just `npm run dev`)
- Check that API files exist in the `/api` directory
- Verify Vercel CLI is installed: `npm install -g vercel`

### "Unexpected end of JSON input"
- This usually means the API returned an empty response
- Check the Vercel dev server logs for errors
- Make sure `RESEND_API_KEY` is set in your `.env` file

## Environment Variables

For local development, create a `.env` file in the project root:

```env
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your-email@example.com
```

Vercel dev will automatically load these from `.env`.

## Production

When deployed to Vercel, both frontend and API routes work automatically - no special setup needed!

