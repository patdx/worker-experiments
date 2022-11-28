import type { Env } from '../../../lib/env';
import { migrate } from '../../../lib/migrate';
import { renderPage } from '../../../lib/render-page';

const d = null;
export default d;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  await migrate(context.env.DB);

  return renderPage(context, {
    apiRefresh: true,
  });
};
