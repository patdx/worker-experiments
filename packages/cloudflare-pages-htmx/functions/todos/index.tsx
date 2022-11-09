// POST = create next todo

import { Form } from '../../lib/components/form';
import { htmlFragment } from '../../lib/html';
import { Item } from '../../lib/components/item';
import { getUuid } from '../../lib/utils/uuid';

export const onRequest: PagesFunction = async (context) => {
  // TODO: I guess ideally, we would want the site to work without
  // javascript too. So this form request would generate a full HTML
  // page instead of just rendering the fragment when it is used
  // in static mode.

  const form = await context.request.formData();
  const text = form.get('text');
  const id = getUuid();

  return htmlFragment(
    <>
      <Form hx-swap-oob="true" />
      <Item id={id} checked={false}>
        {typeof text === 'string' ? text : null}
      </Item>
    </>
  );
};
