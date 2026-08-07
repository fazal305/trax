import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";

// App-wide shortcuts: "/" jumps to Search, Ctrl/Cmd+K opens the command
// palette. Ignored while typing anywhere so they never hijack text entry.
export function useGlobalShortcuts(onOpenCommandPalette) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenCommandPalette();
        return;
      }

      if (isTyping) return;

      if (event.key === "/") {
        event.preventDefault();
        if (location.pathname !== ROUTES.search()) navigate(ROUTES.search());
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate, location.pathname, onOpenCommandPalette]);
}
