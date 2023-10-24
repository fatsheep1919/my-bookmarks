import React from 'react';

import { BookMarkRaw } from '../types';

export const BookMarkContext = React.createContext<{
  bookmarks: BookMarkRaw[],
  curFolder: BookMarkRaw | undefined,
  refresh: () => Promise<void>,
  updateCurFolder: (folder: BookMarkRaw) => void,
}>({
  bookmarks: [],
  curFolder: undefined,
  refresh: async () => {},
  updateCurFolder: (folder: BookMarkRaw) => {},
});