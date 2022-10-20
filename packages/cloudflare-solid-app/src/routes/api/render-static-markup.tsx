import { Component } from 'solid-js';
import { NoHydration } from 'solid-js/web';
import { renderToString } from 'solid-js/web';
import { ApiHandler } from 'solid-start/api/types';

const Plus: Component<{ a: number; b: number }> = (props) => (
  <div>
    <span>{`${props.a} + ${props.b} = `}</span>
    <strong>{props.a + props.b}</strong>
  </div>
);

export const GET: ApiHandler = async (ctx) => {
  const response = new Response(
    '<!DOCTYPE html>' +
      renderToString(() => (
        <NoHydration>
          <html>
            <head>
              <title>Static text</title>
            </head>
            <body>
              <div>
                Hello world <strong>this is a test</strong>
              </div>
              <Plus a={1} b={2} />
              <Plus a={2} b={3} />
            </body>
          </html>
        </NoHydration>
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
