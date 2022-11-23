import render from 'preact-render-to-string';
import type { FC, ReactElement, ReactNode } from 'react';
import { matchRoutes, RouteMatch, RouteObject } from 'react-router';
import manifest from '../dist/manifest.json';
import { ROUTES } from './app';
import { AppContext, SERVER_CONTEXT } from './context';
import {
  unstable_createStaticRouter as createStaticRouter,
  unstable_StaticRouterProvider as StaticRouterProvider,
} from 'react-router-dom/server';
import { unstable_createStaticHandler as createStaticHandler } from '@remix-run/router';
import type { Env } from './env';

export const htmlFragment = (node: ReactElement) => {
  return new Response(render(node), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};

// https://github.com/remix-run/react-router/blob/4d915e3305df5b01f51abdeb1c01bf442453522e/examples/ssr-data-router/src/entry.server.tsx

export const htmlPage = async (
  eventContext: EventContext<unknown, any, Record<string, unknown>>
) => {
  const request = eventContext.request;
  const hxCurrentUrl = request.headers.get('HX-Current-URL');

  // set server context to use in loader
  // in proper remix there is a getLoaderContext API?
  SERVER_CONTEXT.set(request, eventContext as any);

  let isFragment: boolean;
  let routes: RouteObject[];

  if (!hxCurrentUrl) {
    isFragment = false;
    routes = ROUTES;
  } else {
    const change = diffRoutes(
      new URL(hxCurrentUrl).pathname,
      new URL(request.url).pathname
    );

    routes = change?.route ? [change.route] : [];
    isFragment = true;

    // TODO: can we automatically detect/generate the hx-target swap id
    // is there some automatic way to update the parent route when a NavLink
    // is included?
  }

  console.log(routes);

  let { query } = createStaticHandler(routes);
  let context = await query(request);

  if (context instanceof Response) {
    throw context;
  }

  let router = createStaticRouter(routes, context);

  return new Response(
    isFragment
      ? // fragment render:
        render(
          <AppContext.Provider
            value={{
              url: request.url,
              router,
              context,
            }}
          >
            {/* no <Document> in this case */}
            <StaticRouterProvider
              router={router}
              context={context}
              nonce="the-nonce"
            />
          </AppContext.Provider>
        )
      : // full page render:
        '<!DOCTYPE html>' +
        render(
          <AppContext.Provider
            value={{
              url: request.url,
              router,
              context,
            }}
          >
            <Document manifest={manifest}>
              <StaticRouterProvider
                router={router}
                context={context}
                nonce="the-nonce"
              />
            </Document>
          </AppContext.Provider>
        ),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
};

const diffRoutes = (oldUrl: string, newUrl: string) => {
  const oldRoutes = matchRoutes(ROUTES, oldUrl);
  const newRoutes = matchRoutes(ROUTES, newUrl);

  // console.log('OLD');
  // console.log(oldRoutes);
  // console.log('NEW');
  // console.log(newRoutes);
  // console.log(oldRoutes[0].route === newRoutes[0].route);

  const changes: RouteMatch[] = [];

  for (const match of newRoutes ?? []) {
    if (oldRoutes?.some((oldMatch) => match.route === oldMatch.route)) {
      // do nothing
    } else {
      changes.push(match);
    }
  }

  console.log(`CHANGES`, changes);

  return changes?.[0];

  // debugger;
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
