# Deploy the User Management Platform

The repository contains a Render Blueprint for the API and a Vercel configuration for the Vite frontend.

## 1. Create a production PostgreSQL database

Create a managed PostgreSQL database with a public TLS connection string. Keep the full connection string private; it becomes Render's `DATABASE_URL`. Do not use the local Docker URL, and avoid a temporary database for production data.

## 2. Deploy the API to Render

1. Push this repository to GitHub.
2. In Render, create a Blueprint and connect the repository. Render will read `render.yaml` and create the Docker web service.
3. Set the prompted `DATABASE_URL` to the production Postgres connection string, including the provider's required TLS parameters.
4. Set `FRONTEND_URL` to the exact production Vercel origin, for example `https://your-project.vercel.app` (no trailing slash).
5. Deploy. The Docker startup command runs the existing TypeORM migrations before starting Nest. Render checks `/api/v1/health`.
6. Confirm these URLs after the service is live:
   - `https://YOUR-RENDER-SERVICE.onrender.com/api/v1/health`
   - `https://YOUR-RENDER-SERVICE.onrender.com/api/docs`

The Blueprint currently selects Render's Free web plan. Free services can sleep after inactivity and are intended for evaluation rather than production workloads. Choose a paid plan if you need consistent response time and uptime.

## 3. Deploy the frontend to Vercel

1. Import the same GitHub repository as a Vercel project.
2. Leave the Vercel Root Directory at the repository root so the pnpm workspace and lockfile are available.
3. The root `vercel.json` installs the workspace, builds `@ump/web`, publishes `apps/web/dist`, and routes SPA paths to `index.html`.
4. Add this environment variable to the Vercel Production environment:

   ```text
   VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com/api/v1
   ```

5. Deploy the frontend. Add the Vercel preview origin to Render's `FRONTEND_URL` only if you want that preview to call this API; a redeploy is required after changing either environment variable.

## 4. Optional: reduce Render Free cold starts

`deploy/cloudflare-keepalive` contains a Cloudflare Cron Worker that calls `/api/v1/health` every ten minutes. Follow its README after the Render API has a public URL.

This heartbeat can reduce idle spin-downs, but it cannot prevent platform maintenance, instance restarts, exhausted free instance hours, or guarantee availability. It is a cold-start workaround, not an uptime plan.
