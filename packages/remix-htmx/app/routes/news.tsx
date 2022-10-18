import type { LoaderFunction } from "@remix-run/cloudflare";
import { htmlResponse } from "../shared/html-response";

export const loader: LoaderFunction = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return htmlResponse(
    <div>
      <strong>Hello there.</strong> The current time on the server is{" "}
      {new Date().toISOString()}
    </div>
  );
};
