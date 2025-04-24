# Deployment Guide

## Deploying the Backend to Render

1. Create a new Web Service on Render

   - Sign up/log in to [Render](https://render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `project-board-api` (or your preferred name)
     - Root Directory: `apps/api`
     - Build Command: `cd ../.. && pnpm install && pnpm --filter api build`
     - Start Command: `cd dist && node server.js`

2. Set up environment variables

   - Add the following environment variables in the Render dashboard:
     - `NODE_ENV`: `production`
     - `API_PORT`: `10000` (Render will use this internally)
     - `SUPABASE_URL`: Your Supabase URL
     - `SUPABASE_SERVICE_KEY`: Your Supabase service key
     - `FRONTEND_URL`: Your Vercel frontend URL (once you have it)

3. Deploy the service
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Note the URL of your deployed API (e.g., `https://project-board-api.onrender.com`)

## Deploying the Frontend to Vercel

1. Create a new project on Vercel

   - Sign up/log in to [Vercel](https://vercel.com)
   - Click "New Project" and import your GitHub repository
   - Configure the project:
     - Framework Preset: Vite
     - Root Directory: `apps/web`

2. Set up environment variables

   - Add the following environment variables in the Vercel dashboard:
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - `VITE_API_URL`: The URL of your Render API (from step 3 above)

3. Deploy the project
   - Click "Deploy"
   - Wait for the deployment to complete
   - Vercel will provide a URL for your deployed frontend

## Update CORS Configuration

After deploying both services:

1. Go back to your Render dashboard for the API service
2. Add or update the `FRONTEND_URL` environment variable with your Vercel frontend URL
3. Redeploy the API service to apply the changes

## Testing the Deployment

1. Visit your deployed frontend URL
2. Try to log in and use the application
3. Check the Network tab in your browser's developer tools to ensure API calls are working correctly

## Troubleshooting

- If you encounter CORS errors, ensure the `FRONTEND_URL` environment variable in your Render deployment matches exactly with your Vercel URL
- Check the Render logs for any backend errors
- Verify all environment variables are set correctly in both Vercel and Render dashboards
