import clsx from 'clsx';
import { DateTime } from 'luxon';
import {
  type ActionFunctionArgs,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router';
import { useSearchParams } from 'react-router';
import { NavLink } from '../../lib/components/nav-link';
import { SERVER_CONTEXT } from '../../lib/context';
import { hx } from '../../lib/utils/hx';
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

  const id = getUuid();

  await context.env.DB.prepare(
    sql`
      INSERT INTO
        bookings (id, name, day, hour)
      VALUES
        (?, ?, ?, ?)
    `,
  )
    .bind(id, name, day, hour)
    .run()
    .catch((err) => console.log(err, err.cause));

  return new Response(undefined, {
    headers: {
      'HX-Redirect': `/bookings/${id}`,
    },
  });

  // return renderPage(context, {
  //   apiRefresh: true,
  // });
};

const BookingsPage = () => {
  const { schedules } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const [searchParams] = useSearchParams();

  const selectedDay = searchParams.get('day');
  const selectedHour = searchParams.get('hour');

  return (
    <>
      <div className="text-center text-8xl font-thin text-red-300">
        bookings
      </div>

      <div className="py-2 text-right">
        <NavLink href="/bookings/admin" className="border">
          Admin
        </NavLink>
      </div>

      <div className="overflow-x-auto relative">
        <table className="mx-auto">
          <thead>
            <tr>
              <th className="border p-2"></th>
              {schedules.map((schedule) => (
                <th className="border p-2 sticky top-0">
                  {schedule.day.slice(5)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getAllBookingTimes().map((hour) => {
              return (
                <tr>
                  <td className="border p-2 sticky left-0 bg-white">
                    {hour}:00
                  </td>
                  {schedules.map((schedule) => {
                    const slot = schedule.slots.find(
                      (slot) => slot.hour === hour,
                    );

                    const isSelected =
                      searchParams.get('hour') === String(hour) &&
                      searchParams.get('day') === schedule.day;

                    const taken = slot?.taken ?? 0;

                    const displayType =
                      taken === 0
                        ? 'book-now'
                        : taken <= 2
                          ? 'remaining'
                          : taken < MAX_BOOKINGS_PER_SLOT
                            ? 'few-remaining'
                            : undefined;

                    const remaining = MAX_BOOKINGS_PER_SLOT - taken;

                    return (
                      <td
                        className={clsx(
                          'p-2',
                          isSelected ? 'border-2 bg-gray-200' : 'border',
                        )}
                      >
                        {displayType ? (
                          <a
                            href={`?day=${schedule.day}&hour=${hour}`}
                            hx-get={`?day=${schedule.day}&hour=${hour}`}
                            {...hx({
                              'hx-swap': 'none',
                              'hx-push-url': 'true',
                            })}
                            className={clsx(
                              'underline',
                              displayType === 'book-now' && 'text-green-500',
                              displayType === 'remaining' && 'text-orange-500',
                              displayType === 'few-remaining' && 'text-red-500',
                            )}
                          >
                            {displayType === 'book-now' && 'Open'}
                            {displayType === 'remaining' && `${remaining} left`}
                            {displayType === 'few-remaining' &&
                              `Only ${remaining} left`}
                          </a>
                        ) : (
                          'Full'
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedDay && selectedHour ? (
        <form
          hx-post="/bookings"
          className="flex flex-col gap-2 border-2 rounded my-2 p-4 shadow bg-white sticky bottom-0"
        >
          <p>
            Make a booking for {selectedDay} at {selectedHour}:00?
          </p>
          <input type="hidden" name="day" value={selectedDay} />
          <input type="hidden" name="hour" value={selectedHour} />
          <input
            name="name"
            autoFocus
            placeholder="Name"
            className="border flex-1 p-2"
          />
          <button type="submit" className="border p-1 flex-none">
            Submit
          </button>
        </form>
      ) : undefined}
    </>
  );
};

export default BookingsPage;
