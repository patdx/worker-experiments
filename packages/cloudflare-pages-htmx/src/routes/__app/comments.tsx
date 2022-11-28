import {
  type LoaderFunctionArgs,
  useLoaderData,
  ActionFunctionArgs,
} from 'react-router';
import { SERVER_CONTEXT } from '../../../lib/context';
import { renderPage } from '../../../lib/render-page';

const sql = String.raw;

export const loader = async (args: LoaderFunctionArgs) => {
  const context = SERVER_CONTEXT.get(args.request);

  const db = context!.env.DB;

  const comments = await db
    .prepare(
      sql`
        SELECT
          *
        FROM
          comments
      `
    )
    .all<{
      id: number;
      author: string;
      body: string;
      post_slug: string;
    }>();

  return {
    comments: comments.results,
  };
};

export const action = async (args: ActionFunctionArgs) => {
  console.log('Comment action!');
  const context = SERVER_CONTEXT.get(args.request)!;

  const formData = await context.request.formData();
  const author = formData.get('author');
  const body = formData.get('body');

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

  return renderPage(context, {
    apiRefresh: true,
  });
};

const CommentsPage = () => {
  const { comments } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <>
      <div className="text-center text-8xl font-thin text-red-300">
        comments
      </div>
      {/* hx-post="/api/comment" */}
      <form hx-post="/comments">
        <label className="block">Author</label>
        <input name="author" className="border block p-2"></input>
        <label className="block">Body</label>
        <input name="body" className="border block p-2"></input>
        <button type="submit" className="border p-1 block">
          Submit
        </button>
      </form>
      {/* <div className="flex flex-col gap-2"> */}
      {comments?.map((comment) => (
        <div className="p-2">
          <span className="font-bold">{comment.author}</span> {comment.body}
        </div>
      ))}
      {/* </div> */}
      {/* <SimpleTable data={comments} /> */}
    </>
  );
};

export default CommentsPage;
