import type { FC, ReactElement, ReactNode } from 'react';
import render from 'preact-render-to-string';
import manifest from '../dist/manifest.json';

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

export const htmlPage = async (node: ReactNode) => {
  // const manifest = await loadManifest();
  return new Response(
    '<!DOCTYPE html>' + render(<Page manifest={manifest}>{node}</Page>),
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
};

const Page: FC<{ children?: ReactNode; manifest: any }> = ({
  children,
  manifest,
}) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite App</title>
      <link rel="stylesheet" href={`/${manifest['src/main.ts'].css[0]}`} />
      <script type="module" src={`/${manifest['src/main.ts'].file}`}></script>
      <meta
        name="htmx-config"
        content={JSON.stringify({ includeIndicatorStyles: false })}
      />
    </head>
    <body>
      {children}
      {/* <div id="app" dangerouslySetInnerHTML={{ __html: body }}></div> */}
    </body>
  </html>
);
