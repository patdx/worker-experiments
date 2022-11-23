import type { Router, StaticHandlerContext } from '@remix-run/router';
import { createContext } from 'react';
import type { RouteObject } from 'react-router';
import type { Env } from './env';

export const AppContext = createContext<{
  url: string;
  router: Router;
  context: StaticHandlerContext;
}>(undefined as any);

export const SERVER_CONTEXT = new WeakMap<
  Request,
  EventContext<Env, any, Record<string, unknown>>
>();
