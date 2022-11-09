import render from 'preact-render-to-string';
import type { FC, ReactElement } from 'react';
import { matchRoutes, RouteMatch } from 'react-router';
import manifest from '../dist/manifest.json';
import { App, ROUTES } from './app';
import { AppContext } from './context';

export const htmlFragment = (node: ReactElement) => {
  return new Response(render(node), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};

export const htmlPage = async (request: Request) => {
  const hxCurrentUrl = request.headers.get('HX-Current-URL');

  if (hxCurrentUrl) {
    const change = diffRoutes(
      new URL(hxCurrentUrl).pathname,
      new URL(request.url).pathname
    );

    // TODO: can we automatically detect/generate the hx-target swap id
    // is there some automatic way to update the parent route when a NavLink
    // is included?

    return new Response(
      render(
        <AppContext.Provider
          value={{
            url: request.url,
            routes: change?.route ? [change.route] : [],
          }}
        >
          <App />
        </AppContext.Provider>
      ),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }

  // node: ReactNode
  // const manifest = await loadManifest();
  return new Response(
    '<!DOCTYPE html>' +
      render(
        <AppContext.Provider
          value={{
            url: request.url,
            routes: ROUTES,
          }}
        >
          <Document manifest={manifest} />
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

const Document: FC<{ manifest: any }> = ({ manifest }) => (
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
    <body>
      <App />
    </body>
  </html>
);
