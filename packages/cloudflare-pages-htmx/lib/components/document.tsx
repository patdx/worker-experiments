import type { FC, ReactNode } from 'react';

export const Document: FC<{ manifest: any; children?: ReactNode }> = ({
  manifest,
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Todos</title>
      <link
        rel="stylesheet"
        href={`/${manifest['src/entry-client.ts'].css[0]}`}
      />
      <script
        type="module"
        src={`/${manifest['src/entry-client.ts'].file}`}
      ></script>
      <meta
        name="htmx-config"
        content={JSON.stringify({ includeIndicatorStyles: false })}
      />
    </head>
    {/* hx-boost="true" */}
    <body>{children}</body>
  </html>
);
