import React from 'react';

import { BookMarkRaw } from '../types';

export const BookMarkContext = React.createContext<{
  bookmarks: BookMarkRaw[],
  refresh: () => Promise<void>,
}>({
  bookmarks: [],
  refresh: async () => {},
});