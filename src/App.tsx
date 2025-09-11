import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NavBar from './components/Layout/NavBar';
import ThemeProvider from './ThemeProvider';
import Postings from './pages/Postings';
import Graphs from './pages/Graphs';
const Archive = React.lazy(() => import('./pages/Archive'));
const MarkdownViewer = React.lazy(() => import('./pages/MarkdownViewer'));

// App routes with lazy-loaded pages
const RootLayout: React.FC = () => (
  <ThemeProvider>
    <NavBar />
    <div className="app">
      <Outlet />
    </div>
  </ThemeProvider>
);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <Postings /> },
        { path: 'graphs', element: <Graphs /> },
        {
          path: 'archives/:folder',
          element: (
            <React.Suspense fallback={<div>로딩...</div>}>
              <Archive />
            </React.Suspense>
          ),
        },
        {
          path: 'posts/:slug',
          element: (
            <React.Suspense fallback={<div>로딩...</div>}>
              <MarkdownViewer />
            </React.Suspense>
          ),
        },
        { path: '*', element: <Postings /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  } as any
);

export default function App() {
  return (
    <RouterProvider
      router={router}
      // Enable future flags to avoid deprecation warnings
      future={{ v7_startTransition: true }}
    />
  );
}
