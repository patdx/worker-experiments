import { Form } from '../../../lib/components/form';
import { Item } from '../../../lib/components/item';
import { TODOS } from '../../../lib/db';

const IndexPage = () => (
  <>
    <div className="text-center text-8xl font-thin text-red-300">todos</div>
    <div className="mt-2 flex flex-col gap-2">
      <Form />
      <ul id="todo-list" className="flex flex-col gap-2">
        {TODOS.map(({ id, text }) => (
          <Item id={id}>{text}</Item>
        ))}
      </ul>
    </div>
  </>
);

export default IndexPage;
