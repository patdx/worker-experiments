import { renderPage } from '../dist/server/entry-server.mjs';

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // console.log(assetManifest);

  // console.log(`ji +`, url.pathname);

  if (url.pathname.startsWith('/assets')) {
    console.log(`fetching ${url}`);
    return context.env.ASSETS.fetch(context.request);
  }

  return renderPage(context);
};
