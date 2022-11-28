import { NavLink } from '../../lib/components/nav-link';

export default function () {
  return (
    <div>
      login page{' '}
      <NavLink href="/" exact>
        Home
      </NavLink>
    </div>
  );
}
