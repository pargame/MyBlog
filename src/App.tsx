import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/Layout/NavBar';
import ThemeProvider from './styles/ThemeProvider';
import Postings from './pages/Postings';
import Graphs from './pages/Graphs';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="app">
          <NavBar />
          <Routes>
            <Route path="/" element={<Postings />} />
            <Route path="/graphs" element={<Graphs />} />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}
