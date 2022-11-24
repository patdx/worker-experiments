type Migration = {
  name: string;
  up: (db: D1Database) => D1PreparedStatement[];
  down?: (db: D1Database) => D1PreparedStatement[];
};

const sql = String.raw;

type MigrationRow = {
  name: string;
  created_at?: string;
};

export const MIGRATIONS: Migration[] = [
  {
    name: '0001-initial',
    up(db) {
      return [
        db.prepare(sql`
          DROP TABLE
            IF EXISTS comments
        `),
        db.prepare(sql`
          CREATE TABLE
            comments (
              id integer PRIMARY KEY AUTOINCREMENT,
              author text NOT NULL,
              body text NOT NULL,
              post_slug text NOT NULL
            )
        `),
        db.prepare(
          sql`
            CREATE INDEX idx_comments_post_id ON comments (post_slug)
          `
        ),
      ];
    },
  },
  {
    name: '0002-test',
    up(db) {
      return [
        db.prepare(sql`
          SELECT
            DATE()
        `),
      ];
    },
  },
];

export const listMigrations = async (db: D1Database) => {
  // TODO: prepare migrations table first

  const dbResult = await db
    .prepare(
      sql`
        SELECT
          name,
          created_at
        FROM
          migrations
        ORDER BY
          name ASC
      `
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
    db.prepare(sql`
      CREATE TABLE
        IF NOT EXISTS migrations (name text PRIMARY KEY, created_at text NOT NULL)
    `),
    db.prepare(sql`
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
        sql`
          INSERT INTO
            migrations (name, created_at)
          VALUES
            (?, ?)
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
        sql`
          DELETE FROM
            migrations
          WHERE
            name = ?
        `
      )
      .bind(migration.name),
  ]);

  console.log(`Finished reverting migration ${migration.name}`);
};
