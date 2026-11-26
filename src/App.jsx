import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLogic from './app/AppLogic.jsx';
import ArchitecturePage from './pages/ArchitecturePage.jsx';

/**
 * Routes:
 *   /              Device Management app (sign-in → fleet dashboard → device detail; all drawers/dialogs)
 *   /architecture  Device sync architecture reference (?connection=Offline for the offline variant)
 */
export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<AppLogic />} />
        <Route path="/architecture" element={<ArchitectureRoute />} />
        <Route path="*" element={<AppLogic />} />
      </Routes>
    </BrowserRouter>
  );
}

function ArchitectureRoute() {
  const connection = new URLSearchParams(window.location.search).get('connection') === 'Offline' ? 'Offline' : 'Online';
  return <ArchitecturePage connection={connection} />;
}
