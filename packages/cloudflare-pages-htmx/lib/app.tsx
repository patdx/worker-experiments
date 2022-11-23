import { useContext } from 'react';
import { RouteObject, useRoutes } from 'react-router';
import {
  StaticRouter,
  unstable_createStaticRouter,
} from 'react-router-dom/server';
import { AppContext } from './context';
import {
  AboutPage,
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

export const ROUTES: RouteObject[] = [
  {
    // path: '/',
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
            path: '/settings/database',
            loader: settingsDatabasePageLoader,
            element: <SettingsPageDatabase />,
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
];
