# Infrastructure Rules: Strict Environment Protection

**CRITICAL DIRECTIVE: NEVER LOSE USER DATA ON PRODUCTION**

The user has explicitly mandated that under zero circumstances should production user data be overwritten, deleted, or reset. To comply with this directive, the following rules MUST be followed rigidly by the developer and the AI assistant:

## Rule 1: Separation of `.env` Files
- **Never** develop against the live production Supabase database.
- The default `.env` file should point ONLY to a local PostgreSQL instance or a dedicated testing DB.
- Production `.env` variables (like Supabase `DATABASE_URL`) should only be set in the production hosting provider (e.g., Railway).
- Do not commit any production secrets, URLs, or API keys to the Git repository.

## Rule 2: Database Migrations over Database Pushes
- **BANNED IN PRODUCTION:** `npx prisma db push`. This command is destructive and can drop data if the schema drifts or it forces a reset. It is strictly forbidden for the production Supabase database.
- **ALLOWED IN DEVELOPMENT:** `npx prisma db push` may be used locally against the *local* database for rapid prototyping.
- **FOR PRODUCTION:** When deploying schema changes to production, you MUST use `npx prisma migrate dev --name <migration_name>` locally to generate migration SQL files, then use `npx prisma migrate deploy` in production. This preserves existing data and tracks schema changes correctly.

## Rule 3: API & CORS Separation
- **Frontend URL Routing:**
  - Local mode: Frontend calls backend at `http://localhost:3001`
  - Production mode: Vercel frontend MUST use the Railway *Public Domain* URL (not `.internal`) set in `NEXT_PUBLIC_API_URL`.
- **Backend CORS Policy:**
  - Local mode: Backend allows traffic from `http://localhost:3000`
  - Production mode: Backend `process.env.FRONTEND_URL` MUST be `https://msmquranchallenge.vercel.app` (without a trailing slash).
