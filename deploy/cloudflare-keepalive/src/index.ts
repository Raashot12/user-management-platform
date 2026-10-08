interface Env {
  API_HEALTH_URL: string;
}

interface ScheduledController {
  scheduledTime: number;
  cron: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

export default {
  async scheduled(
    _controller: ScheduledController,
    env: Env,
    context: ExecutionContext,
  ): Promise<void> {
    context.waitUntil(pingApi(env));
  },
};

async function pingApi(env: Env): Promise<void> {
  const response = await fetch(env.API_HEALTH_URL, { method: "GET" });
  if (!response.ok) {
    throw new Error(`API health check returned HTTP ${response.status}`);
  }

  console.log(`API health check passed: ${response.status}`);
}
