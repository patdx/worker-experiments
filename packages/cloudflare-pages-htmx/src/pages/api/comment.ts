import type { ActionFunction, LoaderFunction } from 'react-router';
import { SERVER_CONTEXT } from '../../../lib/context';
import type { Env } from '../../../lib/env';
import { renderPage } from '../../entry-server';

const sql = String.raw;

export const action: ActionFunction = (args) => {
  const context = SERVER_CONTEXT.get(args.request);

  const db = context!.env.DB;

  if (args.request.method === 'POST') {
    return onRequestPost(context);
  }
};

const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const author = formData.get('author');
  const body = formData.get('body');
  // const { author, body } = await context.request.f<{
  //   author: string;
  //   body: string;
  // }>();

  console.log({ author, body });

  await context.env.DB.prepare(
    sql`
      INSERT INTO
        comments (author, body)
      VALUES
        (?, ?)
    `
  )
    .bind(author, body)
    .run()
    .catch((err) => console.log(err.cause));

  return renderPage(context, {
    apiRefresh: true,
  });
};
