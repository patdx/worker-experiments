import clsx from "clsx";
import type { FC, ReactNode } from "react";
import { LoadingIcon } from "../components/loading-icon";

export default function Index() {
  return (
    <>
      <Card>
        <CardTitle>Hello</CardTitle>
        This is a test site powered by Remix and React SSR. On the frontend it
        only uses htmx framework, not full React.
      </Card>
      <Card
        innerProps={
          {
            "hx-get": "/news",
            "hx-trigger": "every 5s",
            "hx-target": "#news-target",
            "hx-swap": "beforeend",
          } as any
        }
      >
        <CardTitle className="flex justify-between">
          <span>Auto update from server every 5s</span>
          <LoadingIcon
            id="news-indicator"
            className="htmx-indicator animate-spin"
          />
        </CardTitle>
        <button
          type="button"
          hx-get="/news"
          hx-target="#news-target"
          hx-indicator="#news-indicator"
          hx-swap="beforeend"
          className="py-1 px-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-full"
        >
          Refresh manually
        </button>
        <div id="news-target"></div>
      </Card>

      {/* <div hx-get="/messages">Put To Messages</div>
      <div hx-confirm="Are you sure?">
        <button hx-delete="/account">Delete My Account</button>
        <button hx-put="/account">Update My Account</button>
      </div> */}
    </>
  );
}

export const CardTitle: FC<{ children?: ReactNode; className?: string }> = (
  props
) => (
  <h2 className={clsx("font-bold pb-2 text-lg", props.className)}>
    {props.children}
  </h2>
);

const Card: FC<{
  children?: ReactNode;
  innerProps?: JSX.IntrinsicElements["div"];
}> = (props) => {
  return (
    <div className="p-4">
      <div className="p-4 rounded shadow" {...props.innerProps}>
        {props.children}
      </div>
    </div>
  );
};
