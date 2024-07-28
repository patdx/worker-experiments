type Migration = {
  name: string;
  up: (db: D1Database) => D1PreparedStatement[];
  down?: (db: D1Database) => D1PreparedStatement[];
};

const sql = String.raw;

type MigrationStatus = {
  name: string;
  created_at?: string;
  missing?: boolean;
  migration?: Migration;
};

export const MIGRATIONS: Migration[] = [
  {
    name: '0001-initial',
    up(db) {
      return [
        db.prepare(sql`
          CREATE TABLE
            comments (
              id text PRIMARY KEY,
              message text NOT NULL,
              created_at text NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) STRICT
        `),
      ];
    },
    down(db) {
      return [
        db.prepare(sql`
          DROP TABLE
            comments
        `),
      ];
    },
  },
  {
    name: '0002-bookings',
    up(db) {
      return [
        db.prepare(sql`
          CREATE TABLE
            bookings (
              id text PRIMARY KEY,
              name text NOT NULL,
              day text NOT NULL,
              hour integer NOT NULL,
              created_at text NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) STRICT
        `),
      ];
    },
    down(db) {
      return [
        db.prepare(sql`
          DROP TABLE
            comments
        `),
      ];
    },
  },
];

export const listMigrations = async (db: D1Database) => {
  // TODO: prepare migrations table first

  const [, dbResult] = await db.batch<MigrationStatus>([
    db.prepare(
      sql`
        CREATE TABLE
          IF NOT EXISTS migrations (name text PRIMARY KEY, created_at text NOT NULL)
      `
    ),
    db.prepare(
      sql`
        SELECT
          name,
          created_at
        FROM
          migrations
        ORDER BY
          name ASC
      `
    ),
  ]);

  // .<MigrationStatus>();

  const rows: MigrationStatus[] = [];

  for (const migration of MIGRATIONS) {
    const dbRow = dbResult.results?.find(
      (item) => item.name === migration.name
    );
    if (dbRow) {
      rows.push({
        ...dbRow,
        migration,
      });
    } else {
      rows.push({
        name: migration.name,
        migration,
        // missing: true, // actually, missing should mark in database but no script
      });
    }
  }

  return rows;
};

export type MigrationCommand = {
  direction: 'up' | 'down';
  /** from current to id or all */
  to?: 'all' | string;
  /** one specific migration */
  id?: string;
  step?: number;
};

export const migrate = async (db: D1Database, command?: MigrationCommand) => {
  await db
    .prepare(
      sql`
        CREATE TABLE
          IF NOT EXISTS migrations (name text PRIMARY KEY, created_at text NOT NULL)
      `
    )
    .run();

  if (!command) return;

  const migrations = await listMigrations(db).then((list) =>
    list.filter(
      (item) =>
        // ignore missing for now
        !item.missing
    )
  );

  if (command.direction === 'down') migrations.reverse();

  const availableMigrationsForDirection =
    command.direction === 'down'
      ? migrations.filter((item) => item.created_at)
      : migrations.filter((item) => !item.created_at);

  console.log(migrations.length, availableMigrationsForDirection.length);

  const pendingMigrationSteps: MigrationStatus[] = [];

  if (command.to) {
    if (command.to === 'all') {
      pendingMigrationSteps.push(...availableMigrationsForDirection);
    } else {
      if (
        !availableMigrationsForDirection.some(
          (item) => item.name === command.to
        )
      ) {
        // TODO: filter the range based on "to" before filtering out already applied/etc
        console.warn(`Not possible to apply migration to ${command.to}`);
      } else {
        // stop at a certain id
        for (const step of availableMigrationsForDirection) {
          if (step.name === command.to) {
            break;
          }
          pendingMigrationSteps.push(step);
        }
      }
    }
  }

  if (command.id) {
    const found = availableMigrationsForDirection.find(
      (item) => item.name === command.id
    );
    if (found) {
      pendingMigrationSteps.push(found);
    } else {
      console.log(
        `Could not find ${command.id} or already applied in this direction`
      );
    }
  }

  if (command.step) {
    for (
      let index = 0;
      index < Math.min(command.step, availableMigrationsForDirection.length);
      index++
    ) {
      pendingMigrationSteps.push(availableMigrationsForDirection[index]);
    }
  }

  console.log(
    `doing ${command.direction} on ${pendingMigrationSteps.join(',')}`
  );

  for (const step of pendingMigrationSteps) {
    if (command.direction === 'up') {
      runMigration(db, step.migration!);
    } else {
      revertMigration(db, step.migration!);
    }
  }

  console.log(
    `finished doing ${command.direction} on ${pendingMigrationSteps.join(',')}`
  );
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
