import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { useLocation } from 'react-router';
import { hx, HxProps } from '../utils/hx';

export const NavLink: FC<
  {
    href: string;
    children?: ReactNode;
    className?: string;
    exact?: boolean;
  } & HxProps
> = ({ href, children, className, exact, ...hxProps }) => {
  const location = useLocation();

  const isMatch = exact
    ? location.pathname === href
    : location.pathname.startsWith(href);

  return (
    <a
      href={href}
      className={clsx(
        'hover:bg-gray-200 hover:underline active:bg-gray-300 active:underline transition p-2',
        isMatch && 'font-bold',
        className
      )}
      {...hx({
        'hx-get': href,
        'hx-swap': 'none',
        'hx-push-url': 'true',
      })}
      {...hxProps}
    >
      {children}
    </a>
  );
};
