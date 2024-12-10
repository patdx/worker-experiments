// import { createRequestHandler } from 'react-router';
import type { PagesFunction } from '@cloudflare/workers-types/experimental';
import { renderPage } from '../lib/render-page';

declare global {
  interface CloudflareEnvironment {
    DB: D1Database;
  }
}

declare module 'react-router' {
  export interface AppLoadContext {
    DB: D1Database;
  }
}

// const requestHandler = createRequestHandler(
//   // @ts-expect-error - virtual module provided by React Router at build time
//   () => import('virtual:react-router/server-build'),
//   import.meta.env.MODE,
// );

// export default {
//   fetch(request, env) {
//     return requestHandler(request, {
//       VALUE_FROM_CLOUDFLARE: 'Hello from Cloudflare',
//     });
//   },
// } satisfies ExportedHandler<CloudflareEnvironment>;

export const onRequest: PagesFunction<CloudflareEnvironment> = async (
  context,
) => {
  const url = new URL(context.request.url);

  // console.log(assetManifest);

  // console.log(`ji +`, url.pathname);

  console.log('context.env', context.env);

  if (url.pathname.startsWith('/assets')) {
    console.log(`fetching ${url}`);
    return context.env.ASSETS.fetch(context.request);
  }

  try {
    const page = await renderPage(context);
    console.log('got page');
    return page;
  } catch (err) {
    console.log('error');
    console.log(err);
    return new Response('error', { status: 500 });
  }
};
