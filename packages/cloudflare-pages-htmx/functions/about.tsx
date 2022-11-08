import { htmlPage } from '../lib/html';

export const onRequest: PagesFunction = async (context) => {
  return htmlPage(
    context.request,
    <>
      <div className="text-center text-8xl font-thin text-red-300">about</div>
      <div className="mt-2 mx-auto prose">
        <p>This is an experiment with HTMX.</p>
        <p>
          Source is available at{' '}
          <a href="https://github.com/patdx/worker-experiments/tree/main/packages/cloudflare-pages-htmx">
            github.com/patdx/worker-experiments
          </a>
          .
        </p>
      </div>
    </>
  );
};
