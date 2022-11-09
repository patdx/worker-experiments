import type { FC, ReactNode } from 'react';
import clsx from 'clsx';

export const CardTitle: FC<{ children?: ReactNode; className?: string }> = (
  props
) => (
  <h2 className={clsx('font-bold pb-2 text-lg', props.className)}>
    {props.children}
  </h2>
);

export const Card: FC<{
  children?: ReactNode;
  innerProps?: JSX.IntrinsicElements['div'];
}> = (props) => {
  return (
    <div className="p-4">
      <div className="p-4 rounded shadow" {...props.innerProps}>
        {props.children}
      </div>
    </div>
  );
};
