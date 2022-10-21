import { htmlPage } from '../lib/html';
import { Card, CardTitle } from '../lib/card';
import { LoadingIcon } from '../lib/loading-icon';
import { FC, ReactNode } from 'react';

const Check = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Item: FC<{ children?: ReactNode; isInput?: boolean }> = (props) => (
  <div className="flex gap-2">
    <button type="button" className="flex-none">
      <Check />
    </button>
    <div className="p-2 border flex-1">{props.children}</div>
  </div>
);

export const onRequest: PagesFunction = async (context) => {
  return htmlPage(
    <>
      <div className="text-center text-8xl font-thin text-red-300">todos</div>
      <div className="mt-2 flex flex-col px-16">
        <input
          type="text"
          placeholder="What needs to be done"
          className="p-2 border"
        />
        <Item>Item 1</Item>
        <Item>Item 2</Item>
        <Item>Item 3</Item>
      </div>
      <Card>
        <CardTitle>Hello</CardTitle>
        This is a test site powered by preact-render-to-string on the backend
        and HTMX on the frontend.
      </Card>
      <Card
        innerProps={
          {
            'hx-get': '/news',
            'hx-trigger': 'every 5s',
            'hx-target': '#news-target',
            'hx-swap': 'beforeend',
          } as any
        }
      >
        <CardTitle className="flex justify-between ">
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
};
