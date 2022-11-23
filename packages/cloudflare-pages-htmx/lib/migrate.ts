type Migration = {
  name: string;
  up: (db: D1Database) => D1PreparedStatement[];
  down?: (db: D1Database) => D1PreparedStatement[];
};

type MigrationRow = {
  name: string;
  created_at?: string;
};

export const MIGRATIONS: Migration[] = [
  {
    name: '0001-initial',
    up(db) {
      return [
        db.prepare(`drop table if exists comments`),
        db.prepare(`create table comments (
         id integer primary key autoincrement,
         author text not null,
         body text not null,
         post_slug text not null
       )`),
        db.prepare(`create index idx_comments_post_id on comments (post_slug)`),
      ];
    },
  },
  {
    name: '0002-test',
    up(db) {
      return [db.prepare(`select date()`)];
    },
  },
];

export const listMigrations = async (db: D1Database) => {
  // TODO: prepare migrations table first

  const dbResult = await db
    .prepare(
      `
      SELECT
        name,
        created_at
      FROM
        migrations
      ORDER BY
        name ASC`
    )
    .all<MigrationRow>();

  const rows: MigrationRow[] = [];

  for (const migration of MIGRATIONS) {
    const dbRow = dbResult.results?.find(
      (item) => item.name === migration.name
    );
    if (dbRow) {
      rows.push(dbRow);
    } else {
      rows.push({
        name: migration.name,
      });
    }
  }

  return rows;
};

export const migrate = async (db: D1Database) => {
  const [, migrationStatus] = await db.batch<MigrationRow>([
    db.prepare(`create table if not exists migrations (
      name text primary key,
      created_at text not null
    )`),
    db.prepare(`
      SELECT
        name,
        created_at
      FROM
        migrations
      ORDER BY
        name ASC
    `),
  ]);

  const appliedMigrations = migrationStatus.results?.map((r) => r.name) ?? [];

  console.log(`Applied migrations: ${appliedMigrations}`);

  for (const migration of MIGRATIONS) {
    if (!appliedMigrations.includes(migration.name)) {
      await runMigration(db, migration);
    }
  }
};

export const runMigration = async (db: D1Database, migration: Migration) => {
  console.log(`Applying migration ${migration.name}`);
  await db.batch([
    ...migration.up(db),
    db
      .prepare(
        `
        insert into migrations (name, created_at)
        values (?, ?)
      `
      )
      .bind(migration.name, new Date().toJSON()),
  ]);
  console.log(`Finished migration ${migration.name}`);
};

export const revertMigration = async (db: D1Database, migration: Migration) => {
  console.log(`Reverting migration ${migration.name}`);

  await db.batch([
    ...(migration.down?.(db) ?? []),
    db
      .prepare(
        `
      delete from migrations
      where name = ?
    `
      )
      .bind(migration.name),
  ]);

  console.log(`Finished reverting migration ${migration.name}`);
};
