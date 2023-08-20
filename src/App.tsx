import React, { useCallback, useEffect, useState } from 'react';
import {
  Routes, Route
} from "react-router-dom";

import { BookMarkRaw } from './types';
import { BookMarkContext } from './hooks/useBookMarkContext';
import Layout from './layout';
import DashboardPage from './pages/dashboard';
import ListPage from './pages/list';


function App() {
  const [bookmarks, setBookMarks] = useState<BookMarkRaw[]>([]);

  const load = useCallback(async () => {
    const tree: BookMarkRaw[] = await chrome?.bookmarks?.getTree?.();
    console.log('chrome bookmarks:', tree);
    setBookMarks(tree);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <BookMarkContext.Provider value={{ bookmarks }}>
      <Routes>
        <Route path='/my-bookmark/' element={<Layout />}>
          <Route path='index.html' element={<ListPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="list" element={<ListPage />} />
        </Route>
      </Routes>
    </BookMarkContext.Provider>
  );
}

export default App;
