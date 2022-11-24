import { Navigate, redirect, RouteObject } from 'react-router';
import { SERVER_CONTEXT } from './context';
import {
  AboutPage,
  HtmxOutlet,
  IndexPage,
  Layout,
  settingsDatabasePageLoader,
  SettingsPage,
  SettingsPageAudio,
  SettingsPageDatabase,
  SettingsPageGraphics,
} from './pages';

// TODO: for the moment only absolute path is supported
// because when we try to render a subroute from matchPaths
// we lose the parent url context

const ROUTES: RouteObject[] = [
  {
    // this total stub element is to generate an absolute root
    // level component that will generate a slot that can be
    // used to update the entire app
    element: <HtmxOutlet />,

    children: [
      {
        element: <Layout />,

        children: [
          {
            // path: '/',
            index: true,
            element: <IndexPage />,
          },
          {
            path: '/about',
            element: <AboutPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
            children: [
              {
                index: true,
                loader: () => redirect('/settings/database'),
              },
              {
                path: '/settings/database',
                loader: settingsDatabasePageLoader,
                element: <SettingsPageDatabase />,
                action: async (ctx) => {
                  console.log('action happened');
                },
              },
              {
                path: '/settings/graphics',
                element: <SettingsPageGraphics />,
              },
              {
                path: '/settings/audio',
                element: <SettingsPageAudio />,
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * assign some IDs to the routes now so we can use them
 * in other processing steps like matchRoutes, etc
 * @param routes
 * @param prefix
 */
const prepareRoutes = (routes: RouteObject[], prefix: string) => {
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

prepareRoutes(ROUTES, 'route-');

export { ROUTES };
