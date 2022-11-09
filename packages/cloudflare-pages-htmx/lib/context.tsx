import { createContext } from 'react';
import type { RouteObject } from 'react-router';

export const AppContext = createContext<{ url: string; routes: RouteObject[] }>(
  undefined as any
);
