import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/Page/NavBar';
import Postings from './pages/Postings';
import Graphs from './pages/Graphs';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <Routes>
          <Route path="/" element={<Postings />} />
          <Route path="/graphs" element={<Graphs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
