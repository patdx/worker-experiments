import { htmlPage } from '../lib/html';
import { Card, CardTitle } from '../lib/card';
import { LoadingIcon } from '../lib/loading-icon';

export const onRequest: PagesFunction = async (context) => {
  return htmlPage(
    <>
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
