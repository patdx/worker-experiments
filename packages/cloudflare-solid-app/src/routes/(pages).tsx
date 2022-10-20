import { A, Outlet } from 'solid-start';

export default function PagesLayout() {
  return (
    <>
      <div class="shadow bg-gray-100 sticky top-0">
        <A
          class="p-2 h-full inline-block transition-colors bg-gray-100 hover:bg-white"
          href="/"
        >
          Index
        </A>
        <A
          class="p-2 h-full inline-block transition-colors bg-gray-100 hover:bg-white"
          href="/about"
        >
          About
        </A>
        <a
          class="p-2 h-full inline-block transition-colors bg-gray-100 hover:bg-white"
          href="/api/render-static-markup"
        >
          Render static markup
        </a>
      </div>
      <Outlet />
    </>
  );
}
