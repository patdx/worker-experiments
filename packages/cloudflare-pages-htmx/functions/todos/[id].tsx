import { htmlFragment } from '../../lib/html';
import { Item } from '../../lib/components/item';

export const onRequest: PagesFunction = async (context) => {
  const json = await context.request.json<{
    id: string;
    checked: boolean;
    text: string;
  }>();

  // to avoid the effort of setting up a backend database
  // just having the form request pass the whole state
  // for the item right now

  // const item = TODOS.find((todo) => todo.id === json.id)!;
  return htmlFragment(
    <Item id={json.id} checked={json.checked}>
      {json.text}
    </Item>
  );
};
