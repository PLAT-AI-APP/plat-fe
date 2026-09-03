"use client";
import { useSyncExternalStore } from "react";

const subscribe = (query: string) => (onChange: () => void) => {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

export const useMediaQuery = (query: string) => {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
};
