import {
  type LoaderFunctionArgs,
  useLoaderData,
  ActionFunctionArgs,
} from 'react-router';
import { ButtonGroup, Button } from '../../../../lib/components/button';
import { SimpleTable } from '../../../../lib/components/simple-table';
import { SERVER_CONTEXT } from '../../../../lib/context';
import {
  listMigrations,
  migrate,
  MigrationCommand,
} from '../../../../lib/migrate';
import { renderPage } from '../../../../lib/render-page';
import { sql } from '../../../../lib/sql';
import { hx } from '../../../../lib/utils/hx';

export const loader = async (args: LoaderFunctionArgs) => {
  const context = SERVER_CONTEXT.get(args.request);

  const db = context!.env.DB;

  let migrations;
  let error = '';
  const tables = await db
    .prepare(
      sql`
        PRAGMA table_list
      `
    )
    .all<{
      schema: string;
      name: string;
      type: string;
      ncol: number;
      wr: number;
      strict: number;
    }>();

  const tableInfos = await Promise.all(
    (tables.results ?? []).map((table) =>
      db
        .prepare(`PRAGMA ${table.schema}.table_info(${table.name})`)
        .all()
        .then((result) => ({
          name: table.name,
          schema: table.schema,
          info: result.results,
        }))
    )
  );

  try {
    migrations = await listMigrations(db);
  } catch (e: any) {
    migrations = [] as any[];
    error = JSON.stringify({
      message: e.message,
      cause: e.cause.message,
    });
  }

  tables.meta;

  return { migrations, error, tables: tables.results ?? [], tableInfos };
};

export const action = async (args: ActionFunctionArgs) => {
  const context = SERVER_CONTEXT.get(args.request);

  const json = await args.request.json<MigrationCommand>();

  console.log('got command', json);

  await migrate(context?.env.DB, json);

  return renderPage(context, {
    apiRefresh: true,
  });
};

const SettingsPageDatabase = () => {
  const { migrations, error, tables, tableInfos } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  // API ideas:
  // api/migrate?direction=up&target=all
  // api/migrate?direction=down&step=1
  // api/migrate?direction=up&id={{id}}&confirm=1 (dry run by default)
  // api/migrate?direction=up&id={{id}}&confirm=1&meta-only=1

  return (
    <div className="p-2">
      <p>This is connected to a real Cloudflare D1 Database.</p>
      <pre>{error}</pre>
      <ButtonGroup className="py-2">
        <Button
          {...hx({
            'hx-post': '/settings/database',
            'hx-ext': 'json-enc',
            'hx-vals': JSON.stringify({
              direction: 'up',
              to: 'all',
            }),
          })}
        >
          Run all pending migrations
        </Button>
        <Button
          color="red"
          {...hx({
            'hx-post': '/settings/database',
            'hx-ext': 'json-enc',
            'hx-vals': JSON.stringify({
              direction: 'down',
              to: 'all',
            }),
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
          {migrations.map((migration) => (
            <tr>
              <td className="border p-2">{migration.name}</td>
              <td className="border p-2">
                {migration.created_at ?? 'Not applied'}
              </td>
              <td className="border p-2 flex flex-col gap-1">
                <ButtonGroup>
                  <Button
                    {...hx({
                      'hx-post': '/settings/database',
                      'hx-ext': 'json-enc',
                      'hx-vals': JSON.stringify({
                        direction: 'up',
                        to: migration.name,
                      }),
                    })}
                  >
                    Up to here
                  </Button>
                  <Button
                    {...hx({
                      'hx-post': '/settings/database',
                      'hx-ext': 'json-enc',
                      'hx-vals': JSON.stringify({
                        direction: 'down',
                        to: migration.name,
                      }),
                    })}
                  >
                    Down to here
                  </Button>
                </ButtonGroup>
                <hr />
                <ButtonGroup>
                  <Button
                    {...hx({
                      'hx-post': '/settings/database',
                      'hx-ext': 'json-enc',
                      'hx-vals': JSON.stringify({
                        direction: 'up',
                        id: migration.name,
                      }),
                    })}
                  >
                    Apply this migration
                  </Button>
                  <Button
                    {...hx({
                      'hx-post': '/settings/database',
                      'hx-ext': 'json-enc',
                      'hx-vals': JSON.stringify({
                        direction: 'down',
                        id: migration.name,
                      }),
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
      <h3 className="font-bold text-xl py-1">Tables</h3>
      {/* <SimpleTable data={tables} /> */}
      <div className="grid md:grid-cols-2">
        {tableInfos.map((info) => (
          <div>
            <h4 className="font-bold text-lg py-1">
              {info.schema}.{info.name}
            </h4>
            <SimpleTable data={info.info} hideColumns={['cid']} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPageDatabase;
