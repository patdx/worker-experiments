import { DateTime } from 'luxon';
import {
  type ActionFunctionArgs,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router';
import { useSearchParams } from 'react-router';
import { NavLink } from '../../lib/components/nav-link';
import { SimpleTable } from '../../lib/components/simple-table';
import { SERVER_CONTEXT } from '../../lib/context';
import { renderPage } from '../../lib/render-page';
import { getUuid } from '../../lib/utils/uuid';

const getNext7Days = () => {
  const days: string[] = [];
  const today = DateTime.now();
  for (let index = 0; index < 7; index++) {
    days.push(today.plus({ days: index }).toISODate());
  }
  return days;
};

const FIRST_BOOKING = 10;
const LAST_BOOKING = 18;

const MAX_BOOKINGS_PER_SLOT = 5;

const getAllBookingTimes = () => {
  const times: number[] = [];
  for (let hour = FIRST_BOOKING; hour <= LAST_BOOKING; hour++) {
    times.push(hour);
  }
  return times;
};

type DaySchedule = {
  day: string;
  slots: {
    hour: number;
    taken: number;
  }[];
};

const sql = String.raw;

export const loader = async (args: LoaderFunctionArgs) => {
  const context = SERVER_CONTEXT.get(args.request);

  const db = context!.env.DB;

  const bookings = await db
    .prepare(
      sql`
        SELECT
          *
        FROM
          bookings
        ORDER BY
          created_at DESC
      `,
    )
    .all<{
      id: string;
      message: string;
      created_at: string;
    }>();

  const stats = await db
    .prepare(
      sql`
        SELECT
          day,
          hour,
          COUNT(*) AS cnt
        FROM
          bookings
        GROUP BY
          day,
          hour
      `,
    )
    .all<{
      day: string;
      hour: number;
      cnt: number;
    }>();

  const next7Days = getNext7Days();

  const schedules: DaySchedule[] = [];

  for (const day of next7Days) {
    const schedule: DaySchedule = {
      day,
      slots: [],
    };
    schedules.push(schedule);
    for (const hour of getAllBookingTimes()) {
      const foundStats = stats.results?.find(
        (stat) => stat.day === day && stat.hour === hour,
      );
      schedule.slots.push({
        hour,
        taken: foundStats?.cnt ?? 0,
      });
    }
  }

  return {
    bookings: bookings.results,
    schedules,
    stats: stats.results,
  };
};

export const action = async (args: ActionFunctionArgs) => {
  console.log('Comment action!');
  const context = SERVER_CONTEXT.get(args.request)!;

  const formData = await context.request.formData();

  const day = formData.get('day');
  const hour = formData.get('hour');
  const name = formData.get('name');

  await context.env.DB.prepare(
    sql`
      INSERT INTO
        bookings (id, name, day, hour)
      VALUES
        (?, ?, ?, ?)
    `,
  )
    .bind(getUuid(), name, day, hour)
    .run()
    .catch((err) => console.log(err, err.cause));

  return renderPage(context, {
    apiRefresh: true,
  });
};

const BookingsPage = () => {
  const { bookings, schedules, stats } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;

  const [searchParams] = useSearchParams();

  return (
    <>
      <div className="text-center text-8xl font-thin text-red-300">
        bookings admin
      </div>

      <div className="py-2 text-right">
        <NavLink href="/bookings" className="border">
          Bookings
        </NavLink>
      </div>

      <SimpleTable data={stats} />
      <SimpleTable data={bookings} />
    </>
  );
};

export default BookingsPage;
