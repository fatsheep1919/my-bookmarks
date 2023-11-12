import React from 'react';

import { BookMarkRaw } from '../types';

export const BookMarkContext = React.createContext<{
  bookmarks: BookMarkRaw[],
  curFolder: BookMarkRaw | null,
  modalTargetFolder: BookMarkRaw | null,
  modalTargetItem: BookMarkRaw | null,
  refresh: () => Promise<void>,
  updateCurFolder: (folder: BookMarkRaw) => void,
  openBookMarkModal: (item: BookMarkRaw) => void,
  closeBookMarkModal: () => void,
  openFolderModal: (folder: BookMarkRaw | null) => void,
  closeFolderModal: () => void,
}>({
  bookmarks: [],
  curFolder: null,
  modalTargetFolder: null,
  modalTargetItem: null,
  refresh: async () => {},
  updateCurFolder: (folder: BookMarkRaw) => {},
  openBookMarkModal: (item: BookMarkRaw) => {},
  closeBookMarkModal: () => {},
  openFolderModal: (folder: BookMarkRaw | null) => {},
  closeFolderModal: () => {},
});