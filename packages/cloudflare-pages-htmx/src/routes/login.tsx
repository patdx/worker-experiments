import { hx } from '../../lib/utils/hx';

export default function () {
  return (
    <>
      <form
        {...hx({
          'hx-get': '/',
          'hx-swap': 'none',
          'hx-push-url': 'true',
        })}
        className="flex flex-col justify-center items-center h-screen gap-1"
      >
        <input className="border p-1" placeholder="username" />
        <input className="border p-1" placeholder="password" />
        <button
          type="submit"
          className="w-full p-1 border rounded hover:bg-gray-200"
        >
          Sign in
        </button>
      </form>
    </>
  );
}
