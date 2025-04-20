# Setting Up Supabase with Project Board

This guide will help you configure Supabase authentication and database for the Project Board application.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/log in
2. Create a new project and note down the URL and anon key

## 2. Set Up Environment Variables

### For the Web App:

Create `.env` file in `apps/web/` directory:

```
VITE_SUPABASE_URL=https://your-supabase-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### For the API Server:

Create `.env` file in `apps/api/` directory:

```
API_PORT=4000
SUPABASE_URL=https://your-supabase-project-url.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
```

The service key can be found in your Supabase project dashboard under Project Settings > API.

## 3. Set Up the Database Schema

1. Navigate to the SQL Editor in your Supabase project dashboard
2. Create a new query and paste the contents of the `schema.sql` file from the root directory
3. Run the query to set up tables and RLS policies

## 4. Configure Authentication

1. In the Supabase dashboard, go to Authentication > Providers
2. Make sure Email provider is enabled
3. Configure any additional providers as needed (Google, GitHub, etc.)
4. Customize email templates under Authentication > Email Templates

## 5. Testing the Setup

1. Start the API server: `pnpm dev:api`
2. Start the web app: `pnpm dev:web`
3. Try signing up, creating a project, and testing the authentication flow

## Authentication Flow

The app implements the following authentication flow:

- Users can browse all projects without logging in
- Creating, updating, and deleting projects requires authentication
- Projects can only be edited or deleted by their creators
- Authentication state is maintained across page refreshes

## Troubleshooting

- If you encounter CORS issues, check that your Supabase project has the correct URL patterns allowed
- For API connection issues, verify the service key has the proper permissions
- For database errors, check the Supabase logs in the dashboard
