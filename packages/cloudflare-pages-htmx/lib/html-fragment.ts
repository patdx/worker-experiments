import render from 'preact-render-to-string';
import type { ReactElement } from 'react';

export const htmlFragment = (node: ReactElement) => {
  return new Response(render(node), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
