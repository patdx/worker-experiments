import type { ReactElement } from 'react';
import render from 'preact-render-to-string';

export const html = (node: ReactElement) => {
  return new Response(render(node), {
    headers: {
      'Content-Type': 'text/html',
    },
  });
};
