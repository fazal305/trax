import { useSyncExternalStore } from "react";

// Subscribes to a CSS media query and re-renders when it changes.
// useSyncExternalStore is the correct primitive here (not useState +
// useEffect): matchMedia is an external mutable source, and this avoids an
// extra render-after-mount just to sync the initial value.
// Example: useMediaQuery(`(max-width: ${BREAKPOINTS.tablet}px)`)
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);
      return () => mediaQueryList.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
