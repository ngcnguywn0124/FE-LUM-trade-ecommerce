"use client";

import { useState, useEffect, useCallback } from "react";

const SEARCH_HISTORY_KEY = "lum_search_history";
const MAX_HISTORY_ITEMS = 6;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = useCallback((keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      // Remove if already exists to move to front
      const filtered = prev.filter((item) => item !== trimmed);
      const newHistory = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
