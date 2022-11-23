import type { Env } from '../lib/env';
import { htmlFragment, htmlPage } from '../lib/html';
import { migrate } from '../lib/migrate';

export const onRequest: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;

  await migrate(db);

  const result = await db.batch([
    db
      .prepare(
        `
      insert into comments (author, body, post_slug)
      values (?, ?, ?)`
      )
      .bind('kristian', 'this is the body', 'this is the slug'),
    db.prepare(`select * from comments`),
  ]);
  console.log(result);

  const rows = await db.prepare(`select * from comments`).all();
  return htmlFragment(
    <>
      <div>hello world</div>
      <pre>{JSON.stringify(result, undefined, 2)}</pre>
      <pre>{JSON.stringify(rows, undefined, 2)}</pre>
    </>
  );
};
