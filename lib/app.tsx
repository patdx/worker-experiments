// import { Navigate, redirect, RouteObject } from 'react-router';
// import { SERVER_CONTEXT } from './context';
// import { HtmxOutlet } from './htmx-outlet';
// import {
//   AboutPage,
//   CommentsPage,
//   commentsPageLoader,
//   IndexPage,
//   Layout,
//   settingsDatabasePageLoader,
//   SettingsPage,
//   SettingsPageAudio,
//   SettingsPageDatabase,
//   SettingsPageGraphics,
// } from './pages';

// // TODO: for the moment only absolute path is supported
// // because when we try to render a subroute from matchPaths
// // we lose the parent url context

// const ROUTES: RouteObject[] = [
//   {
//     // this total stub element is to generate an absolute root
//     // level component that will generate a slot that can be
//     // used to update the entire app
//     element: <HtmxOutlet />,

//     children: [
//       {
//         element: <Layout />,

//         children: [
//           {
//             // path: '/',
//             index: true,
//             element: <IndexPage />,
//           },
//           {
//             path: '/comments',
//             element: <CommentsPage />,
//             loader: commentsPageLoader,
//           },
//           {
//             path: '/about',
//             element: <AboutPage />,
//           },
//           {
//             path: '/settings',
//             element: <SettingsPage />,
//             children: [
//               {
//                 index: true,
//                 loader: () => redirect('/settings/database'),
//               },
//               {
//                 path: '/settings/database',
//                 loader: settingsDatabasePageLoader,
//                 element: <SettingsPageDatabase />,
//                 action: async (ctx) => {
//                   console.log('action happened');
//                 },
//               },
//               {
//                 path: '/settings/graphics',
//                 element: <SettingsPageGraphics />,
//               },
//               {
//                 path: '/settings/audio',
//                 element: <SettingsPageAudio />,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];

// export { ROUTES };

export {};
