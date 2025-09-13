import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NavBar from './components/Layout/NavBar';
import ThemeProvider from './ThemeProvider';
import Postings from './pages/Postings';
import Graphs from './pages/Graphs';
import About from './pages/About';
const Archive = React.lazy(() => import('./pages/Archive'));
const MarkdownViewer = React.lazy(() => import('./pages/MarkdownViewer'));
const Pynode = React.lazy(() => import('./pages/Pynode'));

// App routes with lazy-loaded pages
const RootLayout: React.FC = () => (
  <ThemeProvider>
    <NavBar />
    <div className="app">
      <Outlet />
    </div>
  </ThemeProvider>
);

// Normalize Vite BASE_URL and pass it as the router basename so that
// Normalize Vite BASE_URL and pass it as the router basename so routes
// are resolved relative to the deployed subpath (e.g. '/MyBlog').
// This allows all Link components to use router-relative paths like
// '/graphs' while the router handles the base prefix exactly once.
const viteBase = (import.meta.env.BASE_URL as string) || '/';
const basename =
  viteBase === '/' ? undefined : viteBase.endsWith('/') ? viteBase.slice(0, -1) : viteBase;

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <Postings /> },
        { path: 'about', element: <About /> },
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
        {
          path: 'pynode',
          element: (
            <React.Suspense fallback={<div>로딩...</div>}>
              <Pynode />
            </React.Suspense>
          ),
        },
        { path: '*', element: <Postings /> },
      ],
    },
  ],
  {
    basename,
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  } as unknown as Record<string, unknown>
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
