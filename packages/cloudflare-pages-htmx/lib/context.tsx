import type { Env } from './env';

export const SERVER_CONTEXT = new WeakMap<
  Request,
  EventContext<Env, any, Record<string, unknown>>
>();
