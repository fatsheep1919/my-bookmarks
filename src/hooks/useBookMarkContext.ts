import React from 'react';

import { BookMarkRaw } from '../types';

export const BookMarkContext = React.createContext<{
  bookmarks: BookMarkRaw[],
  curFolder: BookMarkRaw | null,
  curItem: BookMarkRaw | null,
  refresh: () => Promise<void>,
  updateCurFolder: (folder: BookMarkRaw) => void,
  openBookMarkModal: (item: BookMarkRaw) => void,
  closeBookMarkModal: () => void,
}>({
  bookmarks: [],
  curFolder: null,
  curItem: null,
  refresh: async () => {},
  updateCurFolder: (folder: BookMarkRaw) => {},
  openBookMarkModal: (item: BookMarkRaw) => {},
  closeBookMarkModal: () => {},
});