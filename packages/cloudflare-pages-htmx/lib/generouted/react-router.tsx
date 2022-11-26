import { Fragment } from 'react';
import type {
  ActionFunction,
  LoaderFunction,
  RouteObject,
} from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { generatePreservedRoutes, generateRegularRoutes } from './core';

/// <reference types="vite/client" />
import type {} from 'vite/client';
import { HtmxOutlet } from '../htmx-outlet';

type Element = () => JSX.Element;
type Module = {
  default: Element;
  loader: LoaderFunction;
  action: ActionFunction;
  ErrorElement: Element;
};

const PRESERVED = import.meta.glob<Module>('/src/pages/(_app|404).{jsx,tsx}', {
  eager: true,
});
const ROUTES = import.meta.glob<Module>(
  ['/src/pages/**/[\\w[]*.{jsx,tsx}', '!**/(_app|404).*'],
  {
    eager: true, // since we are SSR only, it is okay
  }
);

const preservedRoutes = generatePreservedRoutes<Element>(PRESERVED);

const regularRoutes = generateRegularRoutes<RouteObject, Module>(
  ROUTES,
  (module, key) => {
    const Element = module.default;
    // lazy(module);
    // const ErrorElement = lazy(() =>
    //   module().then((module) => ({ default:  }))
    // );
    const index = /index\.(jsx|tsx)$/.test(key) ? { index: true } : {};

    return {
      ...index,
      element: <Element />,
      loader: module.loader,
      action: module.action,
      errorElement: module.ErrorElement ? <module.ErrorElement /> : undefined,
    };
  }
);

const App = preservedRoutes?.['_app'] || Fragment;
const NotFound = preservedRoutes?.['404'] || Fragment;

export const allRoutes: RouteObject[] = [
  {
    // this is very specific too our app, but basically this top level
    // HtmxOutlet generates a div with a known pattern, so if a page inside the
    // regular route updates, it can trigger an update the *root* by replacing
    // the whole app
    element: <HtmxOutlet />,
    children: [
      {
        element: <App children={<Outlet />} />,
        children: [...regularRoutes, { path: '*', element: <NotFound /> }],
      },
    ],
  },
];
