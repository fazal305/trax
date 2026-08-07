import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { NavItem } from "../navigation/NavItem";
import { WorkspaceSwitcher } from "../workspace/WorkspaceSwitcher";
import { NAV_ITEMS } from "../../constants/nav";
import logoMark from "../../assets/logo-mark.svg";
import styles from "./Sidebar.module.css";

export function Sidebar({
  collapsed,
  onToggleCollapse,
  isMobileDrawer,
  mobileOpen,
  onCloseMobile,
}) {
  const showLabels = !collapsed;

  return (
    <>
      {isMobileDrawer && mobileOpen && (
        <div
          className={styles.backdrop}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={[
          styles.sidebar,
          collapsed ? styles.collapsed : "",
          isMobileDrawer ? styles.drawer : "",
          isMobileDrawer && mobileOpen ? styles.drawerOpen : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Primary"
      >
        <div className={styles.brandRow}>
          <img src={logoMark} alt="" className={styles.logo} width={28} height={28} />
          {showLabels && <span className={styles.brandName}>Trax</span>}
          {isMobileDrawer && (
            <button
              className={styles.closeButton}
              onClick={onCloseMobile}
              aria-label="Close navigation"
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>

        <WorkspaceSwitcher collapsed={collapsed} />

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              to={item.path}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              end={item.path === "/"}
            />
          ))}
        </nav>

        {!isMobileDrawer && (
          <button
            className={styles.collapseButton}
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight aria-hidden="true" />
            ) : (
              <>
                <ChevronsLeft aria-hidden="true" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </aside>
    </>
  );
}
