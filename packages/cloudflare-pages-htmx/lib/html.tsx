import { unstable_createStaticHandler as createStaticHandler } from '@remix-run/router';
import render from 'preact-render-to-string';
import type { FC, ReactElement, ReactNode } from 'react';
import { matchRoutes, RouteMatch, RouteObject } from 'react-router';
import {
  unstable_createStaticRouter as createStaticRouter,
  unstable_StaticRouterProvider as StaticRouterProvider,
} from 'react-router-dom/server';
import manifest from '../dist/manifest.json';
import { ROUTES } from './app';
import { SERVER_CONTEXT } from './context';

export const htmlFragment = (node: ReactElement) => {
  return new Response(render(node), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};

// https://github.com/remix-run/react-router/blob/4d915e3305df5b01f51abdeb1c01bf442453522e/examples/ssr-data-router/src/entry.server.tsx

export const htmlPage = async (
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
    routes = ROUTES;
  } else {
    const nextUrl = request.url;

    const change = diffRoutes(
      new URL(hxCurrentUrl).pathname,
      new URL(nextUrl).pathname
    );

    routes = change?.route ? [change.route] : [];
    isFragment = true;

    // TODO: can we automatically detect/generate the hx-target swap id
    // is there some automatic way to update the parent route when a NavLink
    // is included?
  }

  const { query } = createStaticHandler(routes);

  const context = await query(request);

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

const diffRoutes = (oldUrl: string, newUrl: string) => {
  const oldMatches = matchRoutes(ROUTES, oldUrl) ?? [];
  const newMatches = matchRoutes(ROUTES, newUrl) ?? [];

  // console.log('OLD');
  // console.log(oldRoutes);
  // console.log('NEW');
  // console.log(newRoutes);
  // console.log(oldRoutes[0].route === newRoutes[0].route);

  console.log(
    [
      'OLD: ' + oldMatches?.map((match) => match.route.id).join(' -> '),
      'NEW: ' + newMatches?.map((match) => match.route.id).join(' -> '),
    ].join('\n')
  );

  const changes: RouteMatch[] = [];

  // find the index of the first change so we can bump from one level up

  let firstChangeIndex = newMatches.findIndex((newMatch, index) => {
    const oldMatch = oldMatches[index];
    if (!oldMatch) return true; // entered a deeper route
    return newMatch.route.id !== oldMatch.route.id;
  });

  if (firstChangeIndex === -1) {
    // in case of no change just re-render the deepest route
    firstChangeIndex = newMatches.length;
  }

  console.log(`First change at index ${firstChangeIndex}`);

  const renderFromIndex = Math.max(0, firstChangeIndex - 1);

  console.log(`Start rendering from index ${renderFromIndex}`);

  return newMatches[renderFromIndex];
};

const Document: FC<{ manifest: any; children?: ReactNode }> = ({
  manifest,
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Todos</title>
      <link rel="stylesheet" href={`/${manifest['src/main.ts'].css[0]}`} />
      <script type="module" src={`/${manifest['src/main.ts'].file}`}></script>
      <meta
        name="htmx-config"
        content={JSON.stringify({ includeIndicatorStyles: false })}
      />
    </head>
    {/* hx-boost="true" */}
    <body>{children}</body>
  </html>
);
