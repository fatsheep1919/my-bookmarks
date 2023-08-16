import React from 'react';
import {
  Routes, Route
} from "react-router-dom";

import Layout from './layout';
import DashboardPage from './pages/dashboard';
import ListPage from './pages/list';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="list" element={<ListPage />} />
      </Route>
    </Routes>
  );
}

export default App;
