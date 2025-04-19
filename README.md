# Project Board

A web platform where CS students can post projects and find teammates by skill tags.

## Getting Started

### Prerequisites

- Node.js v20 or higher
- pnpm

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

## Future Supabase Plan

In the future, this project will integrate with Supabase for:

- Authentication and user management
- PostgreSQL database for storing projects and user profiles
- Real-time updates for project listings
- Storage for project files and images

The current Express API will be adapted to work with Supabase client, maintaining the same API interface but replacing the in-memory storage with Supabase data access.

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