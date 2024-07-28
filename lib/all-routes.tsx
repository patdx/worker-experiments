import type { RouteObject } from 'react-router';
import ALL_ROUTES from 'virtual:remix-routes';

import { prepareRoutes } from './prepare-routes';

// const ALL_ROUTES: RouteObject[] = [
//   {
//     element: <HtmxOutlet />,
//     children: allRoutes,
//   },
// ];

prepareRoutes(ALL_ROUTES, 'route-', '');

export { ALL_ROUTES };
export { PARENT_ROUTES };

const lines: string[] = [];

const logRoutes = (routes: RouteObject[], indent = 0) => {
  for (const route of routes) {
    lines.push(
      new Array(indent).fill(' ').join('') +
        `${route.path ?? "''"}${route.loader ? ' loader' : ''}${
          route.action ? ' action' : ''
        }${route.element ? '' : ' <empty>'} id=${route.id}`
    );
    if (route.children) {
      logRoutes(route.children, indent + 2);
    }
  }
};

logRoutes(ALL_ROUTES);

export const ROUTE_LOG = lines.join('\n');

const PARENT_ROUTES = new Map<string, string | null>();

const logParentsRoutes = (
  routes: RouteObject[],
  parentId: string | null = null
) => {
  for (const route of routes) {
    PARENT_ROUTES.set(route.id!, parentId);
    if (route.children) {
      logParentsRoutes(route.children, route.id);
    }
  }
};

logParentsRoutes(ALL_ROUTES);

console.log(PARENT_ROUTES);
