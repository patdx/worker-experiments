import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export const htmlResponse = (node: ReactElement) => {
  return new Response(renderToStaticMarkup(node), {
    headers: {
      "Content-Type": "text/html",
    },
  });
};
