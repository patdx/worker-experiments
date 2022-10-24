import { FC } from 'react';
import { HxProps } from './hx';

export const Form: FC<HxProps> = (props) => (
  <form
    id="todo-form"
    hx-post="/todos"
    hx-target="#todo-list"
    hx-swap="afterbegin"
    {...props}
  >
    <input
      type="text"
      name="text"
      placeholder="What needs to be done"
      className="p-2 border w-full"
      autoFocus
    />
  </form>
);
