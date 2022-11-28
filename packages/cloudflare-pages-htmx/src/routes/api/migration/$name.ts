/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Env } from '../../../../lib/env';
import { renderPage } from '../../../../lib/render-page';
import {
  MIGRATIONS,
  revertMigration,
  runMigration,
} from '../../../../lib/migrate';

const d = null;
export default d;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const name = context.params.name as string;

  await runMigration(
    context.env.DB,
    MIGRATIONS.find((item) => item.name === name)!
  );

  return renderPage(context, {
    apiRefresh: true,
  });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const name = context.params.name as string;

  await revertMigration(
    context.env.DB,
    MIGRATIONS.find((item) => item.name === name)!
  );

  return renderPage(context, {
    apiRefresh: true,
  });
};
