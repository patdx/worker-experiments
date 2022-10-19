import { renderToString } from 'solid-js/web';
import cookie from 'cookie';
import { ApiHandler } from 'solid-start/api/types';

export const GET: ApiHandler = async (ctx) => {
  const response = new Response(
    renderToString(() => (
      <div>
        Hello world <strong>this is a test</strong>
      </div>
    )),
    {
      headers: {
        'content-type': 'text/html',
      },
    }
  );

  response.headers.append('set-cookie', 'cookie1=abc');
  response.headers.append('set-cookie', 'cookie2=123');

  console.log(response);

  return response;
};
