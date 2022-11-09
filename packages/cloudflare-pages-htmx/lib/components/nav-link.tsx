import clsx from 'clsx';
import { FC, ReactNode, useContext } from 'react';
import { AppContext } from '../context';
import { hx, HxProps } from '../utils/hx';

export const NavLink: FC<
  {
    href?: string;
    children?: ReactNode;
    className?: string;
  } & HxProps
> = ({ href, children, className, ...hxProps }) => {
  const url = new URL(useContext(AppContext).url);

  return (
    <a
      href={href}
      className={clsx(
        'hover:bg-gray-200 hover:underline active:bg-gray-300 active:underline transition p-2',
        url.pathname === href && 'font-bold',
        className
      )}
      {...hx({
        'hx-get': href,
        'hx-target': 'body',
        // 'hx-swap': 'none',
        'hx-push-url': 'true',
      })}
      {...hxProps}
    >
      {children}
    </a>
  );
};
