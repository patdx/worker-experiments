/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Env } from '../../../lib/env';
import { htmlPage } from '../../../lib/html';
import {
  MIGRATIONS,
  revertMigration,
  runMigration,
} from '../../../lib/migrate';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const name = context.params.name as string;

  await runMigration(
    context.env.DB,
    MIGRATIONS.find((item) => item.name === name)!
  );

  return htmlPage(context, {
    apiRefresh: true,
  });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const name = context.params.name as string;

  await revertMigration(
    context.env.DB,
    MIGRATIONS.find((item) => item.name === name)!
  );

  return htmlPage(context, {
    apiRefresh: true,
  });
};
