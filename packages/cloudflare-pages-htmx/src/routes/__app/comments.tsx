import {
  type LoaderFunctionArgs,
  useLoaderData,
  ActionFunctionArgs,
} from 'react-router';
import { SERVER_CONTEXT } from '../../../lib/context';
import { renderPage } from '../../../lib/render-page';
import { getUuid } from '../../../lib/utils/uuid';
import { IoTrash } from 'react-icons/io5';
import { hx } from '../../../lib/utils/hx';

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
        ORDER BY
          created_at DESC
      `
    )
    .all<{
      id: string;
      message: string;
      created_at: string;
    }>();

  return {
    comments: comments.results,
  };
};

export const action = async (args: ActionFunctionArgs) => {
  console.log('Comment action!');
  const context = SERVER_CONTEXT.get(args.request)!;

  const formData = await context.request.formData();

  if (context.request.method === 'DELETE') {
    const id = formData.get('id');

    await context.env.DB.prepare(
      sql`
        DELETE FROM
          comments
        WHERE
          id = ?
      `
    )
      .bind(id)
      .run();
  } else {
    const message = formData.get('message');

    console.log({ message });

    await context.env.DB.prepare(
      sql`
        INSERT INTO
          comments (id, message)
        VALUES
          (?, ?)
      `
    )
      .bind(getUuid(), message)
      .run()
      .catch((err) => console.log(err, err.cause));
  }

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
      <form hx-post="/comments" className="flex gap-2">
        <input
          name="message"
          placeholder="Message"
          autoFocus
          className="border flex-1 p-2"
        ></input>
        <button type="submit" className="border p-1 flex-none">
          Submit
        </button>
      </form>
      {/* <div className="flex flex-col gap-2"> */}
      {comments?.map((comment) => (
        <div className="py-2 flex items-center group" tabIndex={0}>
          <div className="flex-1">
            <div className="text-gray-500 text-xs">{comment.created_at}</div>
            <div>{comment.message}</div>
          </div>
          <button
            type="button"
            className="flex-none w-10 h-full invisible group-hover:visible group-active:visible group-focus:visible"
            {...hx({
              'hx-delete': '/comments',
              'hx-vals': JSON.stringify({
                id: comment.id,
              }),
            })}
          >
            <IoTrash />
          </button>
        </div>
      ))}
      {/* </div> */}
      {/* <SimpleTable data={comments} /> */}
    </>
  );
};

export default CommentsPage;
