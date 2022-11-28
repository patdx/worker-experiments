import type { RouteObject } from 'react-router';

/**
 * assign some IDs to the routes now so we can use them
 * in other processing steps like matchRoutes, etc
 * @param routes
 * @param prefix
 */
export const prepareRoutes = (
  routes: RouteObject[],
  prefix: string,
  parentPath?: string
) => {
  routes.forEach((route, index) => {
    const id = `${prefix}${index}`;
    route.id = id;

    if (typeof route.path === 'string' && typeof parentPath === 'string') {
      // try to make all routes absolute they work even when doing a render
      // of a partial tree
      route.path = parentPath + '/' + route.path;
    }
    // const el = route.element;
    // if (el) {
    //   route.element = <div id={id}>{el}</div>;
    // }
    if (route.children) {
      prepareRoutes(route.children, `${id}-`, route.path ?? parentPath);
    }
  });
};
