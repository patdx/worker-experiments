import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { SERVER_CONTEXT } from '../../lib/context';
import { sql } from '../../lib/sql';

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

const CommentsPage = () => {
  const { comments } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <>
      <div className="text-center text-8xl font-thin text-red-300">
        comments
      </div>
      <form hx-post="/api/comment">
        <label className="block">Author</label>
        <input name="author" className="border block"></input>
        <label className="block">Body</label>
        <input name="body" className="border block"></input>
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
