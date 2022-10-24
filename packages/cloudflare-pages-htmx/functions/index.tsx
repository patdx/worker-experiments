import { TODOS } from '../lib/db';
import { Form } from '../lib/form';
import { htmlPage } from '../lib/html';
import { Item } from '../lib/item';

// Some inspiration was taken from here:
// https://github.com/rajasegar/todomvc-htmx/blob/main/views/index.pug

export const onRequest: PagesFunction = async (context) => {
  return htmlPage(
    <>
      <div className="text-center text-8xl font-thin text-red-300">todos</div>
      <div className="mt-2 flex flex-col px-16 gap-2">
        <Form />
        <ul id="todo-list" className="flex flex-col gap-2">
          {TODOS.map(({ id, text }) => (
            <Item id={id}>{text}</Item>
          ))}
        </ul>
      </div>
    </>
  );
};
