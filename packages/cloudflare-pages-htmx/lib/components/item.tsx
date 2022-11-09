import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { IoSquareOutline, IoCheckbox } from 'react-icons/io5';

export const Item: FC<{
  id: string;
  children?: ReactNode;
  checked?: boolean;
}> = (props) => (
  <li id={props.id} className={clsx('flex gap-2')}>
    <button
      hx-post={`/todos/${props.id}`}
      hx-vals={JSON.stringify({
        id: props.id,
        checked: !props.checked,
        text: props.children,
      })}
      hx-target={`#${props.id}`}
      hx-ext="json-enc"
      hx-swap="outerHTML"
      type="button"
      className="flx-none"
      // className={clsx('flex-none', props.checked && 'line-through')}
    >
      {props.checked ? <IoCheckbox /> : <IoSquareOutline />}
    </button>
    <div className={clsx('p-2 border flex-1', props.checked && 'line-through')}>
      {props.children}
    </div>
  </li>
);
