import reactDomServer from 'react-dom/server';
import type { RouteObject } from 'react-router';
import {
  createStaticRouter,
  StaticRouterProvider,
  matchRoutes,
  createStaticHandler,
  createRequestHandler,
} from 'react-router';
import { ALL_ROUTES, PARENT_ROUTES } from './all-routes';
import { Document } from './components/document';
import { SERVER_CONTEXT } from './context';
import { diffRoutes } from './diff-routes';

import manifest from '../build/client/.vite/manifest.json';

const render = reactDomServer.renderToStaticMarkup;

// https://github.com/remix-run/react-router/blob/4d915e3305df5b01f51abdeb1c01bf442453522e/examples/ssr-data-router/src/entry.server.tsx

// TODO: I think I need to use something like this
// https://github.com/remix-run/react-router/blob/487961f20c8d663671f3cd45c31c67fa97128dce/packages/react-router/lib/server-runtime/server.ts#L40

export const renderPage = async (
  eventContext: EventContext<unknown, any, Record<string, unknown>>,
  options?: {
    /** if true will just refresh the section for API */
    apiRefresh?: boolean;
  },
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

  const matches = matchRoutes(ALL_ROUTES, new URL(request.url).pathname);

  console.log('matches', matches);

  const deepestMatch = matches && matches[matches.length - 1];
  const isApiRoute =
    deepestMatch &&
    (!deepestMatch.route.element ||
      (request.method !== 'GET' && request.method !== 'HEAD'));

  console.log('api route?', request.method, isApiRoute, deepestMatch);

  // console.log('api route?', request.method, isApiRoute, deepestMatch);

  let isFragment: boolean;
  let routes: RouteObject[];

  if (isApiRoute || !hxCurrentUrl) {
    isFragment = false;
    routes = ALL_ROUTES;
  } else {
    const nextUrl = request.url;

    const change = diffRoutes(
      ALL_ROUTES,
      new URL(hxCurrentUrl).pathname,
      new URL(nextUrl).pathname,
    );

    routes = change?.route ? [change.route] : [];
    isFragment = true;

    // TODO: can we automatically detect/generate the hx-target swap id
    // is there some automatic way to update the parent route when a NavLink
    // is included?
  }

  const { query, queryRoute } = createStaticHandler(routes);

  let context;

  if (isApiRoute) {
    context = await queryRoute(request, {
      routeId: deepestMatch.route.id,
    });
  } else {
    context = await query(request);
  }

  if (context instanceof Response) {
    // eg, a redirect
    return context;
    // throw context;
  }

  const router = createStaticRouter(routes, context);

  let outputString: string;

  if (isFragment) {
    // fragment render, no <Document>

    const parentId = PARENT_ROUTES.get(routes[0].id!);

    const outletId = parentId ? `outlet-${parentId}` : 'app';

    console.log(routes[0].id, parentId, outletId);

    outputString =
      // TODO: streaming?
      reactDomServer.renderToStaticMarkup(
        <div
          // TODO: figure out the parent parent id more correctly
          id={outletId}
          data-route={routes[0].path}
          hx-swap-oob="innerHTML"
        >
          <StaticRouterProvider
            router={router}
            context={context}
            hydrate={false}
          />
        </div>,
      );
  } else {
    outputString = // full page render:
      '<!DOCTYPE html>' +
      render(
        <Document manifest={manifest}>
          <StaticRouterProvider
            router={router}
            context={context}
            hydrate={false}
          />
        </Document>,
      );
  }

  return new Response(outputString, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
