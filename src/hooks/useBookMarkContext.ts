import React from 'react';

import { BookMarkRaw } from '../types';

export const BookMarkContext = React.createContext<{bookmarks: BookMarkRaw[]}>({
  bookmarks: []
});