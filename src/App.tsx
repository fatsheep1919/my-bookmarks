import React, { useCallback, useEffect, useState } from 'react';
import {
  Routes, Route
} from "react-router-dom";

import { BookMarkRaw } from './types';
import { BookMarkContext } from './hooks/useBookMarkContext';
import Layout from './layout';

function App() {
  const [bookmarks, setBookMarks] = useState<BookMarkRaw[]>([]);
  const [curFolder, setCurFolder] = useState<BookMarkRaw>();

  const refresh = useCallback(async () => {
    const tree: BookMarkRaw[] = await chrome?.bookmarks?.getTree?.();
    console.log('chrome bookmarks:', tree);
    setBookMarks(tree);
  }, []);

  const updateCurFolder = useCallback((folder: BookMarkRaw) => {
    setCurFolder(folder);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <BookMarkContext.Provider
      value={{
        bookmarks,
        curFolder,
        refresh,
        updateCurFolder
      }
    }>
      <Routes>
        <Route path='/my-bookmark/index.html' element={<Layout />}></Route>
      </Routes>
    </BookMarkContext.Provider>
  );
}

export default App;
