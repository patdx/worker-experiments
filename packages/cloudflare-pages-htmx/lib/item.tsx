import { FC, ReactNode } from 'react';
import { IoSquareOutline, IoCheckbox } from 'react-icons/io5';

const Check = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const Item: FC<{
  id: string;
  children?: ReactNode;
  isInput?: boolean;
  checked?: boolean;
}> = (props) => (
  <div id={props.id} className="flex gap-2">
    <button
      hx-post={`/todos/${props.id}`}
      hx-vals={JSON.stringify({ id: props.id, checked: !props.checked })}
      hx-target={`#${props.id}`}
      hx-ext="json-enc"
      hx-swap="outerHTML"
      type="button"
      className="flex-none"
    >
      {props.checked ? <IoCheckbox /> : <IoSquareOutline />}
    </button>
    <div className="p-2 border flex-1">{props.children}</div>
  </div>
);
