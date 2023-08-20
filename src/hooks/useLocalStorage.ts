import { useState, useEffect } from "react";

import type { BookMarkRaw } from "../types";

const LOCAL_DATA_KEY = 'MYBMS';

export function useLocalStorage(): [BookMarkRaw[], (data: BookMarkRaw[]) => void] {
  const [localValue, setLocalValue] = useState<Array<BookMarkRaw>>(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_DATA_KEY);
      const arr = item ? JSON.parse(item) : [];
      return arr.sort((a: BookMarkRaw, b: BookMarkRaw) => a.id.localeCompare(b.id));
    } catch (err) {
      console.error(`Error retrieving value from local storage: ${err}`);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(localValue));
    } catch (err) {
      console.error(`Error storing value in local storage: ${err}`);
    }
  }, [localValue]);
  
  return [localValue, setLocalValue];
}