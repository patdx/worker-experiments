import { createContext, FC, ReactElement, ReactNode, useContext } from 'react';
import render from 'preact-render-to-string';
import manifest from '../dist/manifest.json';
import clsx from 'clsx';

// const loadManifest = async () => {
//   return import('../dist/manifest.json').then((m) => m.default);
// };

export const htmlFragment = (node: ReactElement) => {
  return new Response(render(node), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};

export const htmlPage = async (request: Request, node: ReactNode) => {
  // const manifest = await loadManifest();
  return new Response(
    '<!DOCTYPE html>' +
      render(
        <UrlContext.Provider value={request.url}>
          <Page manifest={manifest}>{node}</Page>
        </UrlContext.Provider>
      ),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
};

const UrlContext = createContext<string>(undefined as any);

const Page: FC<{ children?: ReactNode; manifest: any }> = ({
  children,
  manifest,
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
    <body hx-boost="true">
      <div className="flex">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
      </div>
      {children}
      {/* <div id="app" dangerouslySetInnerHTML={{ __html: body }}></div> */}
    </body>
  </html>
);

const NavLink: FC<{ href?: string; children?: ReactNode }> = (props) => {
  const url = new URL(useContext(UrlContext));

  return (
    <a
      href={props.href}
      className={clsx(
        'hover:bg-gray-200 hover:underline active:bg-gray-300 active:underline transition p-2',
        url.pathname === props.href && 'font-bold'
      )}
    >
      {props.children}
    </a>
  );
};
