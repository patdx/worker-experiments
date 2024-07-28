import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import type { HxProps } from '../utils/hx';

export const ButtonGroup: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={clsx('flex flex-wrap gap-1', className)}>{children}</div>;

export const Button: FC<
  {
    children?: ReactNode;
    className?: string;
    color?: 'red';
  } & HxProps
> = ({ children, className, color, ...hxProps }) => {
  return (
    <button
      type="button"
      className={clsx(
        'hover:underline active:underline transition p-1',
        color === 'red'
          ? 'bg-red-200 hover:bg-red-300 active:bg-red-400 text-red-800'
          : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400',
        className
      )}
      {...hxProps}
    >
      {children}
    </button>
  );
};
