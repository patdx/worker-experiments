import type { Env } from '../../lib/env';
import { htmlPage } from '../../lib/html';
import { migrate } from '../../lib/migrate';

const sql = String.raw;

export const onRequestPost: PagesFunction<Env> = async (context) => {
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

  return htmlPage(context, {
    apiRefresh: true,
  });
};
