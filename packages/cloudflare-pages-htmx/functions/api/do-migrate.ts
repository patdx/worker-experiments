import type { Env } from '../../lib/env';
import { htmlPage } from '../../lib/html';
import { migrate } from '../../lib/migrate';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  await migrate(context.env.DB);

  return htmlPage(context, {
    apiRefresh: true,
  });
};
