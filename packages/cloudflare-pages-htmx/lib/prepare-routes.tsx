import type { RouteObject } from 'react-router';

/**
 * assign some IDs to the routes now so we can use them
 * in other processing steps like matchRoutes, etc
 * @param routes
 * @param prefix
 */
export const prepareRoutes = (routes: RouteObject[], prefix: string) => {
  routes.forEach((route, index) => {
    const id = `${prefix}${index}`;
    route.id = id;
    // const el = route.element;
    // if (el) {
    //   route.element = <div id={id}>{el}</div>;
    // }
    if (route.children) {
      prepareRoutes(route.children, `${id}-`);
    }
  });
};
