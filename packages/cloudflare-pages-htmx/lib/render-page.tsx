import {
  matchRoutes,
  unstable_createStaticHandler as createStaticHandler,
} from '@remix-run/router';
import render from 'preact-render-to-string';
import type { RouteObject } from 'react-router';
import {
  unstable_createStaticRouter as createStaticRouter,
  unstable_StaticRouterProvider as StaticRouterProvider,
} from 'react-router-dom/server';
import manifest from '../dist/client/manifest.json';
import { ALL_ROUTES } from './all-routes';
import { Document } from './components/document';

import { SERVER_CONTEXT } from './context';
import { diffRoutes } from './diff-routes';

// https://github.com/remix-run/react-router/blob/4d915e3305df5b01f51abdeb1c01bf442453522e/examples/ssr-data-router/src/entry.server.tsx

export const renderPage = async (
  eventContext: EventContext<unknown, any, Record<string, unknown>>,
  options?: {
    /** if true will just refresh the section for API */
    apiRefresh?: boolean;
  }
) => {
  let request = eventContext.request;

  const hxCurrentUrl = request.headers.get('HX-Current-URL');

  if (options?.apiRefresh) {
    if (!hxCurrentUrl) throw new Error(`Missing hx-current-url header`);
    request = new Request(hxCurrentUrl, { method: 'GET' });
  }

  // set server context to use in loader
  // in proper remix there is a getLoaderContext API?
  SERVER_CONTEXT.set(request, eventContext as any);

  let isFragment: boolean;
  let routes: RouteObject[];

  if (!hxCurrentUrl) {
    isFragment = false;
    routes = ALL_ROUTES;
  } else {
    const nextUrl = request.url;

    const change = diffRoutes(
      ALL_ROUTES,
      new URL(hxCurrentUrl).pathname,
      new URL(nextUrl).pathname
    );

    routes = change?.route ? [change.route] : [];
    isFragment = true;

    // TODO: can we automatically detect/generate the hx-target swap id
    // is there some automatic way to update the parent route when a NavLink
    // is included?
  }

  const matches = matchRoutes(ALL_ROUTES, new URL(request.url).pathname);
  const deepestMatch = matches && matches[matches.length - 1];
  const isApiRoute = deepestMatch && !deepestMatch.route.element;

  const { query, queryRoute } = createStaticHandler(routes);

  let context;

  if (isApiRoute) {
    context = await queryRoute(request, deepestMatch.route.id);
  } else {
    context = await query(request);
  }

  if (context instanceof Response) {
    // eg, a redirect
    return context;
    // throw context;
  }

  const router = createStaticRouter(routes, context);

  return new Response(
    isFragment
      ? // fragment render:
        render(
          // {/* no <Document> in this case */}
          <div
            // TODO: figure out the parent parent id more correctly
            id={`outlet-${routes[0].id}`.slice(0, -2)}
            data-route={routes[0].path}
            hx-swap-oob="innerHTML"
          >
            <StaticRouterProvider
              router={router}
              context={context}
              hydrate={false}
            />
          </div>
        )
      : // full page render:
        '<!DOCTYPE html>' +
        render(
          <Document manifest={manifest}>
            <StaticRouterProvider
              router={router}
              context={context}
              hydrate={false}
            />
          </Document>
        ),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
};
