import { TODOS } from '../lib/db';
import { htmlPage } from '../lib/html';
import { Item } from '../lib/item';

export const onRequest: PagesFunction = async (context) => {
  return htmlPage(
    <>
      <div className="text-center text-8xl font-thin text-red-300">todos</div>
      <div className="mt-2 flex flex-col px-16">
        <input
          type="text"
          placeholder="What needs to be done"
          className="p-2 border"
        />
        {TODOS.map(({ id, text }) => (
          <Item id={id}>{text}</Item>
        ))}
      </div>
    </>
  );
};
