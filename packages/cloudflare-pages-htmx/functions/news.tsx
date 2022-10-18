import { htmlFragment } from '../lib/html';

export const onRequest: PagesFunction = async (context) => {
  return htmlFragment(
    <div>
      <strong>Hello there.</strong> The current time on the server is{' '}
      {new Date().toISOString()}
    </div>
  );
};
