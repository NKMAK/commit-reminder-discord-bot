import type { Context, Next } from 'hono';
import type { Env } from '../types/env';

export async function authMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  const authHeader = c.req.header('Authorization');
  const expectedAuth = `Bearer ${c.env.API_KEY}`;

  if (authHeader !== expectedAuth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
}
