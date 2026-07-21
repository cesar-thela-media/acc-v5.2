"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * useState backed by localStorage — admin pages use this so mutations
 * (approve/reject applications, suspend/reinstate members, create/edit/delete
 * events and resources) survive page refreshes instead of vanishing.
 *
 * Under Next.js SSR the server cannot read localStorage, so the component
 * always starts with `initialData` on the first render.  A mount effect then
 * rehydrates from localStorage if a prior session saved data there.  Once
 * hydration is complete every subsequent state change is written back.
 */
export function usePersistedState<T>(
  key: string,
  initialData: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Always start with initialData on the server; the mount effect rehydrates.
  const [state, setState] = useState<T>(initialData);
  const [hydrated, setHydrated] = useState(false);

  // On mount only: rehydrate from localStorage (if present), then mark the
  // component as hydrated so the persist effect knows it's safe to write.
  useEffect(() => {
    let stored: T | null = null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) stored = JSON.parse(raw) as T;
    } catch {
      // corrupted entry — stay on initialData
    }
    if (stored !== null) setState(stored);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-only — rehydration happens once per key lifecycle

  // Persist every state change to localStorage AFTER hydration is complete.
  // Skipping writes before hydration prevents the initialData from overwriting
  // previously saved mutations that the mount effect hasn't rehydrated yet.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // quota exceeded or private-browsing block — silently no-op
    }
  }, [key, state, hydrated]);

  // Wrap setState so caller gets the same API as useState.
  const setPersistedState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(value);
    },
    []
  );

  return [state, setPersistedState];
}
