import type { ActionFunction, LoaderFunction } from 'react-router';
import { SERVER_CONTEXT } from '../../../lib/context';
import type { Env } from '../../../lib/env';
import { renderPage } from '../../entry-server';

export default null;

const sql = String.raw;

export const action: ActionFunction = async (args) => {
  console.log('Comment action!');
  const context = SERVER_CONTEXT.get(args.request)!;

  const formData = await context.request.formData();
  const author = formData.get('author');
  const body = formData.get('body');

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
