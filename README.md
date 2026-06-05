# Hackathon Starter

A production-ready Next.js starter optimized for a 3-person team shipping a one-day hackathon demo. It is intentionally monolithic: frontend, API routes, Server Actions, Supabase, and OpenAI all live inside one deployable Next.js app.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Supabase Database and optional Auth
- OpenAI SDK with the Responses API
- Vercel deployment

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

The app runs with demo data before Supabase is configured, so teammates can start editing UI immediately.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
OPENAI_API_KEY=sk-proj-your-openai-api-key
OPENAI_MODEL=gpt-5.4-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```text
app/
  (app)/dashboard/        Main dashboard, loading, and error states
  (auth)/login/           Optional Supabase Auth screen
  api/ai/generate-summary OpenAI example endpoint
components/
  ui/                     shadcn-style primitives
hooks/
lib/
  supabase/               Browser, server, and middleware clients
types/
supabase/schema.sql       Copy-paste database schema
```

## Supabase Setup

1. Create a Supabase project.
2. Copy your project URL and publishable key into `.env.local`.
3. Open the SQL Editor and run `supabase/schema.sql`.
4. Restart `npm run dev`.

The default policies allow any authenticated user to work with shared hackathon tasks. For a no-login internal demo, you can temporarily change each policy role from `authenticated` to `anon, authenticated`.

Auth is optional. To remove it, delete:

- `app/(auth)/`
- `app/auth/callback/`
- `proxy.ts`
- the sign-out form in `components/app-sidebar.tsx`

## OpenAI Setup

Add `OPENAI_API_KEY` to `.env.local`.

Example endpoint:

```http
POST /api/ai/generate-summary
Content-Type: application/json

{
  "text": "Paste meeting notes, raw research, form responses, or a chat transcript."
}
```

Response:

```json
{
  "summary": "..."
}
```

## Local Development

```bash
npm run dev
npm run lint
npm run build
```

Use the existing Task entity as the fastest CRUD path:

- Update `types/database.ts`
- Update `supabase/schema.sql`
- Update `lib/tasks.ts`
- Update `components/task-form.tsx` and `components/task-table.tsx`

## Vercel Deployment

1. Push this repository to GitHub.
2. Import it in Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy.

No Docker, separate backend, Redis, queues, or extra services are required.

## AI-Agent Friendly Notes

- Read `AGENTS.md` before making changes.
- Keep SDK initialization lazy.
- Keep new features close to the route or component that uses them.
- Prefer obvious names over generalized abstractions.
- Add only the setup required for the current demo.
