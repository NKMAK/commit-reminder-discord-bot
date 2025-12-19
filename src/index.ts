import { Hono } from 'hono';
import type { Env } from './types/env';
import checkContributionRoute from './routes/check-contribution';
import { checkAndNotify } from './handlers/contribution-handler';

const app = new Hono<{ Bindings: Env }>();

app.route('/check-contribution', checkContributionRoute);

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(checkAndNotify(env));
  },
};
