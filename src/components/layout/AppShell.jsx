import { useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CommandPalette } from "../common/CommandPalette";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useUI } from "../../contexts/UIContext";
import { useGlobalShortcuts } from "../../hooks/useGlobalShortcuts";
import { BREAKPOINTS } from "../../constants/breakpoints";
import styles from "./AppShell.module.css";

export function AppShell() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.tablet}px)`);
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUI();
  const location = useLocation();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  useGlobalShortcuts(openCommandPalette);

  // Close the mobile drawer on navigation. Derived at render time (React
  // docs: "Adjusting state when a prop changes") rather than an effect,
  // since this is pure UI state, not a sync with an external system.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setMobileNavOpen(false);
  }

  return (
    <div className={styles.shell}>
      <Sidebar
        collapsed={isMobile ? false : sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapsed}
        isMobileDrawer={isMobile}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />
      <div className={styles.mainColumn}>
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} onOpenCommandPalette={openCommandPalette} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
