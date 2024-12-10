import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { useSearchParams } from 'react-router';
import { NavLink } from '../../lib/components/nav-link';
import { SERVER_CONTEXT } from '../../lib/context';

const sql = String.raw;

export const loader = async (args: LoaderFunctionArgs) => {
  const id = args.params['id'];

  const context = SERVER_CONTEXT.get(args.request);

  const db = context!.env.DB;

  const booking = await db
    .prepare(
      sql`
        SELECT
          *
        FROM
          bookings
        WHERE
          id = ?
      `,
    )
    .bind(id)
    .first<{
      id: string;
      name: string;
      day: string;
      hour: number;
    }>();

  return {
    booking: booking,
  };
};

const BookingsPage = () => {
  const { booking } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const [searchParams] = useSearchParams();

  return (
    <>
      <div className="text-center text-8xl font-thin text-red-300">
        bookings
      </div>

      <div className="text-center flex flex-col gap-2">
        <p>Thank you for your reservation!</p>

        <div>ID: {booking.id}</div>
        <div>Name: {booking.name}</div>
        <div>
          {booking.day} at {booking.hour}:00
        </div>
      </div>

      <div className="py-2 text-center">
        <NavLink href="/bookings" className="border">
          Make another reservation
        </NavLink>
      </div>

      {/* <pre>{JSON.stringify(booking, undefined, 2)}</pre> */}
      {/* <div>{booking}</div> */}

      {/* <SimpleTable data={stats} />
      <SimpleTable data={bookings} /> */}
    </>
  );
};

export default BookingsPage;
