import type { RouteObject } from 'react-router';
import allRoutes from 'virtual:remix-routes';
import { HtmxOutlet } from './htmx-outlet';

import { prepareRoutes } from './prepare-routes';

const ALL_ROUTES: RouteObject[] = [
  {
    element: <HtmxOutlet />,
    children: allRoutes,
  },
];

prepareRoutes(ALL_ROUTES, 'route-');

export { ALL_ROUTES };
