import { useState, useEffect } from "react";

import type { BookMark } from "../types";

const LOCAL_DATA_KEY = 'MYBMS';

export function useLocalStorage(): [BookMark[], (data: BookMark[]) => void] {
  const [localValue, setLocalValue] = useState<Array<BookMark>>(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_DATA_KEY);
      const arr = item ? JSON.parse(item) : [];
      return arr.sort((a: BookMark, b: BookMark) => a.id - b.id);
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