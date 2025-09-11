import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NavBar from './components/Layout/NavBar';
import ThemeProvider from './ThemeProvider';
import Postings from './pages/Postings';
import Graphs from './pages/Graphs';
import Archive from './pages/Archive';
import MarkdownViewer from './pages/MarkdownViewer';

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
        { path: 'archives/:folder', element: <Archive /> },
        { path: 'posts/:slug', element: <MarkdownViewer /> },
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
      // Also opt-in to rendering future flags to avoid console deprecation warnings
      future={{ v7_startTransition: true }}
    />
  );
}
