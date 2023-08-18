import React, { createContext } from 'react';

import { BookMarkRaw } from '../types';

export const BookMarkContext = React.createContext<{bookmarks: BookMarkRaw[]}>({
  bookmarks: []
});