import { html } from '../src/lib/html';

export const onRequest: PagesFunction = async (context) => {
  console.log('request');
  // return html(<div>Hello world</div>);
  return new Response('hello');
};
