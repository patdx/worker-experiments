import { htmlPage } from '../../lib/html';

export const onRequest: PagesFunction = async (context) => {
  return htmlPage(context.request);
};
