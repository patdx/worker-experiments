# cloudflare-pages-htmx (Worker experiments)

Preview: https://cloudflare-pages-htmx.pages.dev/

It uses Vite to prebundle the browser side assets (at the moment, just htmx and
tailwind).

The "pages" are generated using Cloudflare Pages functions and they render plain
HTML which is served to the client.

It may be possible to improve it slightly by automatically converting static
pages to html, but the server response speed is already extremely fast.

Since hydration is not needed, the server side is actually using preact and
preact-render-to-string.

## remix-htmx

This experiment is archived. Source available at:
https://github.com/patdx/worker-experiments/tree/daa8c391928c24d9e3e8578311b086d75c013c35/packages/remix-htmx

Preview: https://remix-alpine-htmx.pmil.workers.dev/

This experiment did not work so well because while Remix supports no Javascript
mode, it does not support "some javascript" mode. If I want to have htmx and
tailwind bundled and hashed, Remix also seems to be bundling the full react,
which defeats the purpose.

## cloudflare-solid-app

This experiment is archived. Source available at:
https://github.com/patdx/worker-experiments/tree/daa8c391928c24d9e3e8578311b086d75c013c35/packages/cloudflare-solid-app

Preview: https://cloudflare-solid-app.pages.dev/

Just a simple served solid start app.

The URL https://cloudflare-solid-app.pages.dev/api/hello will serve two
`set-cookie` headers.

## other archived experiments:

- https://github.com/patdx/worker-experiments/tree/77ff9f7aae68e94e960f7b84c97a13dec1ce16a7/packages/http-test-go
- https://github.com/patdx/worker-experiments/tree/77ff9f7aae68e94e960f7b84c97a13dec1ce16a7/packages/http-test-rust
- https://github.com/patdx/worker-experiments/tree/77ff9f7aae68e94e960f7b84c97a13dec1ce16a7/packages/level-cloudflare-kv
  (Cloudflare D1 is cheaper and faster than trying to add such features on top
  of KV)

## Future ideas:

- The htmx syntax is awkward to mix with React, because of prop passing and
  TypeScript. It may be nice to create some hooks or components that generate
  nice output syntax.
