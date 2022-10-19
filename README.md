# htmx-experiments

This repo contains some simple experiments with htmx to see what kind of small
dynamic site is possible.

Even with something like HTMX, JSX is my favorite templating language. Also, as
the cloudflare workers runtime works on JSX, and HTMX needs to be paired with a
server that can generate HTML, they seem like they would be good companions for
for a small, fast, website.

## remix-htmx

Preview: https://remix-alpine-htmx.pmil.workers.dev/

This experiment did not work so well because while Remix supports no Javascript
mode, it does not support "some javascript" mode. If I want to have htmx and
tailwind bundled and hashed, Remix also seems to be bundling the full react,
which defeats the purpose.

## cloudflare-pages-htmx

Preview: https://cloudflare-pages-htmx.pages.dev/

This example works a little better. It uses Vite to prebundle the browser side
assets (at the moment, just htmx and tailwind).

The "pages" are generated using Cloudflare Pages functions and they render plain
HTML which is served to the client.

It may be possible to improve it slightly by automatically converting static
pages to html, but the server response speed is already extremely fast.

Since hydration is not needed, the server side is actually using preact and
preact-render-to-string.

## cloudflare-solid-app

Preview: https://cloudflare-solid-app.pages.dev/

Just a simple served solid start app.

The URL https://cloudflare-solid-app.pages.dev/api/hello will serve two `set-cookie` headers.

## Future ideas:

- The htmx syntax is awkward to mix with React, because of prop passing and
  TypeScript. It may be nice to create some hooks or components that generate
  nice output syntax.
