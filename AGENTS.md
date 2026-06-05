# Agent Notes

This is a one-day hackathon starter. Optimize for shipping a working demo quickly.

## Architecture

- Keep everything inside the Next.js app.
- Prefer Server Components for reads and Server Actions for simple mutations.
- Use API routes for external clients, webhooks, file uploads, and AI endpoints.
- Do not add a separate backend, Docker, queues, Redis, or microservices unless the team explicitly changes direction.

## Where Things Live

- `app/` routes, layouts, server actions, API routes
- `components/` reusable UI and feature components
- `components/ui/` shadcn-style primitives
- `lib/` integrations and app helpers
- `types/` shared TypeScript types
- `supabase/schema.sql` copy-paste database schema

## Conventions

- Keep code direct and readable.
- Prefer small typed functions over generic abstractions.
- Validate API inputs with `zod`.
- Keep SDK clients lazy so `next build` works before env vars are configured.
- If changing database tables, update `types/database.ts`, `supabase/schema.sql`, and the README setup notes together.

## Verification

Run before handoff when dependencies are installed:

```bash
npm run lint
npm run build
```
