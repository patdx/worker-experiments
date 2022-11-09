import { useContext } from 'react';
import { RouteObject, useRoutes } from 'react-router';
import { StaticRouter } from 'react-router-dom/server';
import { AppContext } from './context';
import {
  AboutPage,
  IndexPage,
  Layout,
  SettingsPage,
  SettingsPageAudio,
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

const MyRoutes = () => {
  const routes = useRoutes(useContext(AppContext).routes);
  return routes;
};

export const App = () => {
  const url = new URL(useContext(AppContext).url).pathname;

  return (
    <StaticRouter location={url}>
      <MyRoutes />
    </StaticRouter>
  );
};
