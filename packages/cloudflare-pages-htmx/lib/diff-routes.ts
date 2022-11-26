import { matchRoutes, RouteObject } from 'react-router-dom';

export const diffRoutes = (
  routes: RouteObject[],
  oldUrl: string,
  newUrl: string
) => {
  const oldMatches = matchRoutes(routes, oldUrl) ?? [];
  const newMatches = matchRoutes(routes, newUrl) ?? [];

  // console.log('OLD');
  // console.log(oldRoutes);
  // console.log('NEW');
  // console.log(newRoutes);
  // console.log(oldRoutes[0].route === newRoutes[0].route);

  console.log(
    [
      'OLD: ' + oldMatches?.map((match) => match.route.id).join(' -> '),
      'NEW: ' + newMatches?.map((match) => match.route.id).join(' -> '),
    ].join('\n')
  );

  // find the index of the first change so we can bump from one level up

  let firstChangeIndex = newMatches.findIndex((newMatch, index) => {
    const oldMatch = oldMatches[index];
    if (!oldMatch) return true; // entered a deeper route
    return newMatch.route.id !== oldMatch.route.id;
  });

  if (firstChangeIndex === -1) {
    // in case of no change just re-render the deepest route
    firstChangeIndex = newMatches.length;
  }

  console.log(`First change at index ${firstChangeIndex}`);

  const renderFromIndex = Math.max(0, firstChangeIndex - 1);

  console.log(`Start rendering from index ${renderFromIndex}`);

  return newMatches[renderFromIndex];
};
