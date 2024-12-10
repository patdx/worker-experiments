import reactDomServer from 'react-dom/server';
import type { ReactElement } from 'react';

export const htmlFragment = (node: ReactElement) => {
  return new Response(reactDomServer.renderToStaticMarkup(node), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
