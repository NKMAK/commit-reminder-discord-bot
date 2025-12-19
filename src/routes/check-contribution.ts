import { Hono } from 'hono';
import type { Env } from '../types/env';
import { authMiddleware } from '../middlewares/auth';
import { checkAndNotify } from '../handlers/contribution-handler';

const app = new Hono<{ Bindings: Env }>();

app.use('*', authMiddleware);

app.get('/', async (c) => {
  try {
    const result = await checkAndNotify(c.env);
    return c.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return c.json(
      {
        success: false,
        error: errorMessage,
        notified: true,
      },
      500
    );
  }
});

export default app;
