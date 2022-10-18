import type { LoaderFunction } from "@remix-run/cloudflare";
import { htmlResponse } from "../shared/html-response";

export const loader: LoaderFunction = async () => {
  return htmlResponse(
    <>
      <div>hello world</div>
      <div>hi there</div>
    </>
  );
};
