// Some inspiration was taken from here:
// https://github.com/rajasegar/todomvc-htmx/blob/main/views/index.pug

import type { FC, ReactNode } from 'react';
import { Outlet } from 'react-router';
import { Form } from './components/form';
import { Item } from './components/item';
import { NavLink } from './components/nav-link';
import { TODOS } from './db';

export const Layout: FC<{ children?: ReactNode }> = ({ children }) => (
  <>
    <div className="flex">
      <NavLink hx-target="#main-page" href="/">
        Home
      </NavLink>
      <NavLink hx-target="#main-page" href="/about">
        About
      </NavLink>
      <NavLink hx-target="#main-page" href="/settings">
        Settings
      </NavLink>
    </div>
    <div id="main-page">
      <Outlet />
    </div>
  </>
);

export const IndexPage = () => (
  <>
    <div className="text-center text-8xl font-thin text-red-300">todos</div>
    <div className="mt-2 flex flex-col px-16 gap-2">
      <Form />
      <ul id="todo-list" className="flex flex-col gap-2">
        {TODOS.map(({ id, text }) => (
          <Item id={id}>{text}</Item>
        ))}
      </ul>
    </div>
  </>
);

export const AboutPage = () => (
  <>
    <div className="text-center text-8xl font-thin text-red-300">about</div>
    <div className="mt-2 mx-auto prose">
      <p>This is an experiment with HTMX.</p>
      <p>
        Source is available at{' '}
        <a href="https://github.com/patdx/worker-experiments/tree/main/packages/cloudflare-pages-htmx">
          github.com/patdx/worker-experiments
        </a>
        .
      </p>
    </div>
  </>
);

export const SettingsPage = () => (
  <>
    <div className="text-center text-8xl font-thin text-red-300">settings</div>
    <div className="mt-2 mx-auto max-w-md">
      <div className="prose max-w-none">
        <p>This is a fake settings page</p>
      </div>
      <div className="border">
        <div className="flex border-b rounded">
          <NavLink
            // TODO: can we generate this "target" id automatically?
            hx-target="#settings-sub-page"
            className="border-r"
            href="/settings/graphics"
          >
            Graphics
          </NavLink>
          <NavLink
            hx-target="#settings-sub-page"
            className="border-r"
            href="/settings/audio"
          >
            Audio
          </NavLink>
        </div>
        <div
          // TODO: can we generate this "target" id automatically?
          id="settings-sub-page"
          className="min-h-[10rem]"
        >
          <Outlet />
        </div>
      </div>
    </div>
  </>
);

export const SettingsPageGraphics = () => {
  return <div>Graphics settings</div>;
};

export const SettingsPageAudio = () => {
  return <div>Audio settings</div>;
};