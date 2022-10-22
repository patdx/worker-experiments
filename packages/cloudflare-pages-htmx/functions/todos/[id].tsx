import { TODOS } from '../../lib/db';
import { htmlFragment } from '../../lib/html';
import { Item } from '../../lib/item';

export const onRequest: PagesFunction = async (context) => {
  const json = await context.request.json<{ id: string; checked: boolean }>();

  const item = TODOS.find((todo) => todo.id === json.id)!;
  return htmlFragment(
    <Item id={item.id} checked={json.checked}>
      {item.text}
    </Item>
  );
};
