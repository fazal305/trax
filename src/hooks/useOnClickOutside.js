import { useEffect } from "react";

// Calls `handler` when a pointer event occurs outside `ref`'s element.
// Used to close dropdowns/menus on outside click.
export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    function handlePointerDown(event) {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [ref, handler]);
}
