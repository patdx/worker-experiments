import type { FC } from 'react';
import { NavLink } from '../../lib/components/nav-link';
import { HtmxOutlet } from '../../lib/htmx-outlet';

const Layout: FC = () => (
  <>
    <div className="flex">
      <NavLink href="/" exact>
        Home
      </NavLink>
      <NavLink href="/comments">Comments</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/settings">Settings</NavLink>
      <div className="flex-1"></div>
      <NavLink href="/login">Login</NavLink>
    </div>
    <HtmxOutlet className="p-2" />
  </>
);

export default Layout;
