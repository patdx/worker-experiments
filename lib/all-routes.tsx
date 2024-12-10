import type { RouteObject, ServerBuild } from 'react-router';

// @ts-expect-error virtual module
import * as _SERVER_BUILD from 'virtual:react-router/server-build';

const SERVER_BUILD = _SERVER_BUILD as ServerBuild;
const ALL_ROUTES = Object.values(SERVER_BUILD.routes);

console.log('ALL_ROUTES', ALL_ROUTES);

// import { prepareRoutes } from './prepare-routes';

// const ALL_ROUTES: RouteObject[] = [
//   {
//     element: <HtmxOutlet />,
//     children: allRoutes,
//   },
// ];

// prepareRoutes(ALL_ROUTES, 'route-', '');

export { ALL_ROUTES };
export { PARENT_ROUTES };

const lines: string[] = [];

const logRoutes = (routes: RouteObject[], indent = 0) => {
  for (const route of routes) {
    lines.push(
      new Array(indent).fill(' ').join('') +
        `${route.path ?? "''"}${route.loader ? ' loader' : ''}${
          route.action ? ' action' : ''
        }${route.element ? '' : ' <empty>'} id=${route.id}`,
    );
    if (route.children) {
      logRoutes(route.children, indent + 2);
    }
  }
};

logRoutes(ALL_ROUTES);

export const ROUTE_LOG = lines.join('\n');

const PARENT_ROUTES = new Map<string, string | null>();

const logParentsRoutes = (routes: RouteObject[]) => {
  for (const route of routes) {
    PARENT_ROUTES.set(route.id!, route.parentId);
    if (route.children) {
      logParentsRoutes(route.children);
    }
  }
};

logParentsRoutes(ALL_ROUTES);

console.log(PARENT_ROUTES);
