import type { Env } from './env';

export const SERVER_CONTEXT = new WeakMap<
  Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EventContext<Env, any, Record<string, unknown>>
>();
