import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { ButtonGroup, Button } from '../../../lib/components/button';
import { SimpleTable } from '../../../lib/components/simple-table';
import { SERVER_CONTEXT } from '../../../lib/context';
import { listMigrations } from '../../../lib/migrate';
import { sql } from '../../../lib/sql';
import { hx } from '../../../lib/utils/hx';

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

const SettingsPageDatabase = () => {
  const { migrations, error, tables, tableInfos } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  return (
    <div className="p-2">
      <h3>Tables</h3>
      <SimpleTable data={tables} />
      {tableInfos.map((info) => (
        <>
          <h4>{info.name}</h4>
          <SimpleTable data={info.info} />
        </>
      ))}
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

export default SettingsPageDatabase;