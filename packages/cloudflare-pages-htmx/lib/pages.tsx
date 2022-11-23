// Some inspiration was taken from here:
// https://github.com/rajasegar/todomvc-htmx/blob/main/views/index.pug

import type { FC, ReactNode } from 'react';
import {
  LoaderFunction,
  LoaderFunctionArgs,
  Outlet,
  useLoaderData,
} from 'react-router';
import { Form } from './components/form';
import { Item } from './components/item';
import { NavLink } from './components/nav-link';
import { SERVER_CONTEXT } from './context';
import { TODOS } from './db';
import { listMigrations } from './migrate';
import { hx } from './utils/hx';

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
      <div className="border">
        <div className="flex border-b rounded">
          <NavLink
            // TODO: can we generate this "target" id automatically?
            hx-target="#settings-sub-page"
            className="border-r"
            href="/settings/database"
          >
            Database
          </NavLink>
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

export const settingsDatabasePageLoader = async (args: LoaderFunctionArgs) => {
  const context = SERVER_CONTEXT.get(args.request);

  const migrations = await listMigrations(context!.env.DB);

  return migrations;
};

export const SettingsPageDatabase = () => {
  const migrations = useLoaderData() as Awaited<
    ReturnType<typeof settingsDatabasePageLoader>
  >;

  return (
    <div className="p-2">
      <h3>Migration status</h3>
      <p>This is connected to a real Cloudflare D1 Database.</p>
      <button
        type="button"
        className="bg-gray-200 p-1 hover:bg-gray-300"
        {...hx({
          'hx-post': '/api/do-migrate',
        })}
      >
        Run all migrations
      </button>
      <table>
        <thead>
          <tr>
            <th className="border">Name</th>
            <th className="border">Applied at</th>
            <th className="border"></th>
          </tr>
        </thead>
        <tbody>
          {migrations.map((migration) => (
            <tr>
              <td className="border">{migration.name}</td>
              <td className="border">
                {migration.created_at ?? 'Not applied'}
              </td>
              <td>
                <button
                  type="button"
                  className="bg-gray-200 p-1 hover:bg-gray-300"
                  {...hx({
                    'hx-post': `/api/migration/${encodeURIComponent(
                      migration.name
                    )}`,
                  })}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className="bg-gray-200 p-1 hover:bg-gray-300"
                  {...hx({
                    'hx-delete': `/api/migration/${encodeURIComponent(
                      migration.name
                    )}`,
                  })}
                >
                  Revert
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SettingsPageGraphics = () => {
  return <div>Graphics settings</div>;
};

export const SettingsPageAudio = () => {
  return <div>Audio settings</div>;
};
