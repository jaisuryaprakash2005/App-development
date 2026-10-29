import React, { createContext, useCallback, useContext, useState } from 'react';

const SavedContext = createContext(null);

/**
 * Wrap your app with <SavedProvider> to enable global saved-property state.
 */
export function SavedProvider({ children }) {
  const [savedIds, setSavedIds] = useState(new Set());

  const toggle = useCallback((id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const isSaved = useCallback((id) => savedIds.has(id), [savedIds]);

  return (
    <SavedContext.Provider value={{ savedIds, toggle, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
}

/** Hook — use inside any component to access saved state */
export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used inside <SavedProvider>');
  return ctx;
}
