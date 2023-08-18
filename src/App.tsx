import React, { useCallback, useEffect } from 'react';
import {
  Routes, Route
} from "react-router-dom";

import Layout from './layout';
import DashboardPage from './pages/dashboard';
import ListPage from './pages/list';

function App() {

  const load = useCallback(async () => {
    const tree = await chrome?.bookmarks?.getTree?.();
    console.log('chrome bookmarks:', tree);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Routes>
      {/* <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="list" element={<ListPage />} />
      </Route> */}
      <Route path='/my-bookmark/' element={<Layout />}>
        <Route path='index.html' element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="list" element={<ListPage />} />
      </Route>
    </Routes>
  );
}

export default App;
