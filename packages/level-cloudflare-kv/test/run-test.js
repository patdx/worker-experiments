import AutoIndex from 'level-auto-index';

// https://github.com/bcomnes/level-auto-index

// Add an entry with key 'a' and value 1
// await db.put('a' + Math.random(), 1);

export const runTest = async (
  /** @type {import('abstract-level').AbstractLevel} */ db
) => {
  const sub = db.sublevel('sub', { valueEncoding: 'json' });
  await sub.put('b', 'hello world');

  const users = db.sublevel('users', { valueEncoding: 'json' });
  const usersById = db.sublevel('usersById', {
    valueEncoding: 'json',
  });
  const usersByIdIndex = AutoIndex(
    users,
    usersById,
    AutoIndex.keyReducer('id')
  );

  await users.put('x', { id: '123', name: 'user1' });

  await users.batch([
    { type: 'put', key: 'y', value: { id: '124', name: 'user2' } },
    { type: 'put', key: 'z', value: { id: '125', name: 'user3' } },
  ]);

  for await (const [key, value] of db.iterator({ valueEncoding: 'json' })) {
    console.log(JSON.stringify({ [key]: value })); // 2
  }

  // console.log(
  // TODO: it would be nice if these functions supported async too
  usersByIdIndex.get('124', (err, val) => console.log(`got`, err, val));
  // );

  await users.del('x');
};
