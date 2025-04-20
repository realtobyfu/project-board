# Deploying to Supabase Using MCP

This guide shows how to deploy the Project Board schema directly to Supabase using MCP (Multi-Cloud Provider) commands.

## Prerequisites

- Make sure you have a Supabase account and organization
- Have the project URL and API keys ready

## Steps to Deploy

1. List your Supabase organizations:

```
mcp_supabase_list_organizations
```

2. Get your organization details:

```
mcp_supabase_get_organization --id <your-organization-id>
```

3. Check the cost of creating a new project:

```
mcp_supabase_get_cost --type project --organization_id <your-organization-id>
```

4. Confirm the cost:

```
mcp_supabase_confirm_cost --type project --recurrence monthly --amount <amount>
```

5. Create a new Supabase project:

```
mcp_supabase_create_project --name "Project Board" --organization_id <your-organization-id> --confirm_cost_id <cost-confirmation-id> --region <preferred-region>
```

6. Get the project details:

```
mcp_supabase_get_project --id <project-id>
```

7. Apply the database schema:

```
mcp_supabase_apply_migration --project_id <project-id> --name "initial_schema" --query "$(cat schema.sql)"
```

8. Get the API URL:

```
mcp_supabase_get_project_url --project_id <project-id>
```

9. Get the anonymous API key:

```
mcp_supabase_get_anon_key --project_id <project-id>
```

## Setting Up Environment Variables

Use the URL and API keys from the previous steps to set up your `.env` files:

### For Web App (`apps/web/.env`):

```
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### For API Server (`apps/api/.env`):

```
API_PORT=4000
SUPABASE_URL=<project-url>
SUPABASE_SERVICE_KEY=<service-key>
```

## Generate TypeScript Types

You can generate TypeScript types for your Supabase tables:

```
mcp_supabase_generate_typescript_types --project_id <project-id>
```

## Checking Logs

To debug issues, you can check the logs:

```
mcp_supabase_get_logs --project_id <project-id> --service postgres
```

## Managing the Project

- To pause the project (to save costs):

  ```
  mcp_supabase_pause_project --project_id <project-id>
  ```

- To restore a paused project:
  ```
  mcp_supabase_restore_project --project_id <project-id>
  ```
