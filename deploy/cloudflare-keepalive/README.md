# Optional Render keep-alive Worker

This Cloudflare Worker pings the Nest API health endpoint every ten minutes. Set it up only if you want to reduce Render Free cold starts; it does not provide production uptime guarantees.

The Worker is configured with `workers_dev: false`, so it does not need a public HTTP route. If this Cloudflare account has never used Workers, open the Workers section in the dashboard once and complete the `workers.dev` onboarding before deploying. Cloudflare requires that account setup to create Cron Triggers.

## Deploy

From the repository root, install Wrangler if needed, then set the API health URL and deploy:

```powershell
corepack pnpm dlx wrangler secret put API_HEALTH_URL --config deploy/cloudflare-keepalive/wrangler.jsonc
```

When prompted, enter:

```text
https://YOUR-RENDER-SERVICE.onrender.com/api/v1/health
```

Then deploy:

```powershell
corepack pnpm dlx wrangler deploy --config deploy/cloudflare-keepalive/wrangler.jsonc
```

Cron schedules use UTC. Confirm successful executions in the Worker logs in the Cloudflare dashboard.
