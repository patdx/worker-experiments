import type { Env } from '../../lib/env';
import { migrate } from '../../lib/migrate';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  await migrate(context.env.DB);

  return new Response(null, {
    headers: {
      'HX-Refresh': 'true',
    },
  });
};
