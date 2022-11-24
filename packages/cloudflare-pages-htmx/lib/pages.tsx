// Some inspiration was taken from here:
// https://github.com/rajasegar/todomvc-htmx/blob/main/views/index.pug

import { FC, useContext } from 'react';
import {
  LoaderFunctionArgs,
  Outlet,
  UNSAFE_RouteContext,
  useLoaderData,
} from 'react-router';
import { Button, ButtonGroup } from './components/button';
import { Form } from './components/form';
import { Item } from './components/item';
import { NavLink } from './components/nav-link';
import { SERVER_CONTEXT } from './context';
import { TODOS } from './db';
import { listMigrations } from './migrate';
import { hx } from './utils/hx';

export const HtmxOutlet: FC<{ className?: string }> = ({ className }) => {
  // TODO: see if there is an official hook
  // that can be used instead
  const context = useContext(UNSAFE_RouteContext);
  const lastMatch = context.matches[context.matches.length - 1];
  return (
    <div id={`outlet-${lastMatch.route.id}`} className={className}>
      <Outlet />
    </div>
  );
};

export const Layout: FC = () => (
  <>
    <div className="flex">
      <NavLink href="/" exact>
        Home
      </NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/settings">Settings</NavLink>
    </div>
    <HtmxOutlet className="p-2" />
  </>
);

export const IndexPage = () => (
  <>
    <div className="text-center text-8xl font-thin text-red-300">todos</div>
    <div className="mt-2 flex flex-col gap-2">
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
    <div className="mt-2 mx-auto">
      <div className="border">
        <div className="flex border-b rounded">
          <NavLink className="border-r" href="/settings/database">
            Database
          </NavLink>
          <NavLink className="border-r" href="/settings/graphics">
            Graphics
          </NavLink>
          <NavLink className="border-r" href="/settings/audio">
            Audio
          </NavLink>
        </div>

        <HtmxOutlet className="min-h-[10rem]" />
      </div>
    </div>
  </>
);

export const settingsDatabasePageLoader = async (args: LoaderFunctionArgs) => {
  const context = SERVER_CONTEXT.get(args.request);

  let migrations;
  let error = '';

  try {
    migrations = await listMigrations(context!.env.DB);
  } catch (e: any) {
    migrations = [] as any[];
    error = JSON.stringify({
      message: e.message,
      cause: e.cause.message,
    });
  }

  return { migrations, error };
};

export const SettingsPageDatabase = () => {
  const { migrations, error } = useLoaderData() as Awaited<
    ReturnType<typeof settingsDatabasePageLoader>
  >;

  return (
    <div className="p-2">
      <h3>Migration status</h3>
      <p>This is connected to a real Cloudflare D1 Database.</p>
      <pre>{error}</pre>
      <ButtonGroup className="py-2">
        <Button
          {...hx({
            'hx-post': '/api/do-migrate',
          })}
        >
          Run all pending migrations
        </Button>
        <Button
          color="red"
          {...hx({
            'hx-post': '/api/do-migrate',
          })}
        >
          Revert all migrations
        </Button>
      </ButtonGroup>
      <table>
        <thead>
          <tr>
            <th className="border">Name</th>
            <th className="border">Applied at</th>
            <th className="border"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2"></td>
            <td className="border p-2"></td>
            <td className="border p-2">
              <Button>Down to here</Button>
            </td>
          </tr>
          {migrations.map((migration) => (
            <tr>
              <td className="border p-2">{migration.name}</td>
              <td className="border p-2">
                {migration.created_at ?? 'Not applied'}
              </td>
              <td className="border p-2 flex flex-col gap-1">
                <ButtonGroup>
                  <Button>Up to here</Button>
                  <Button>Down to here</Button>
                </ButtonGroup>
                <hr />
                <ButtonGroup>
                  <Button
                    {...hx({
                      'hx-post': `/api/migration/${encodeURIComponent(
                        migration.name
                      )}`,
                    })}
                  >
                    Apply this migration
                  </Button>
                  <Button
                    {...hx({
                      'hx-delete': `/api/migration/${encodeURIComponent(
                        migration.name
                      )}`,
                    })}
                  >
                    Roll back this migration
                  </Button>
                </ButtonGroup>
                <hr />
                <ButtonGroup>
                  <Button>Mark applied</Button>
                  <Button>Mark rolled back</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SettingsPageGraphics = () => {
  return <div className="p-2">Graphics settings</div>;
};

export const SettingsPageAudio = () => {
  return <div className="p-2">Audio settings</div>;
};
