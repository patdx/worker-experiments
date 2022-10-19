import { Outlet } from 'solid-start';

export default function PagesLayout() {
  return (
    <div>
      <h1>This is a page</h1>
      <Outlet />
    </div>
  );
}
