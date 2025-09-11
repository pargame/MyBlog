import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/Layout/NavBar';
import ThemeProvider from './ThemeProvider';
import Postings from './pages/Postings';
import Graphs from './pages/Graphs';
import MarkdownViewer from './pages/MarkdownViewer';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="app">
          <NavBar />
          <Routes>
            <Route path="/" element={<Postings />} />
            <Route path="/graphs" element={<Graphs />} />
            <Route path="/posts/:slug" element={<MarkdownViewer />} />
            {/* Redirect any unknown route to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}
