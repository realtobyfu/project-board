# Project Board

A web platform where CS students can post projects and find teammates by skill tags.

## Getting Started

### Prerequisites

- Node.js v20 or higher
- pnpm
- Supabase account (for authentication)

### Installation

```bash
# Install dependencies
pnpm install

# Start the API server
pnpm dev:api

# Start the Web client
pnpm dev:web
```

The web client will be available at http://localhost:5173
The API server will be available at http://localhost:4000

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your Supabase URL and anon key from the project settings
3. Create a `.env` file in the `apps/web` directory using the `.env.example` template:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. In your Supabase project, enable Email authentication in the Authentication section

#### Supabase Integration

This project uses Supabase for:

- Authentication and user management
- User authorization for project creation, editing, and deletion
- Only authenticated users can create, edit, or delete projects

## Project Structure

```
project-board/
│
├─ apps/
│  ├─ web/      # React client
│  └─ api/      # Express server
│
├─ packages/
│  └─ ui/       # Shared UI components
│
└─ tsconfig.base.json
```
