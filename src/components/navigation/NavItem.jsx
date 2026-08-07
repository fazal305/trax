import { NavLink } from "react-router-dom";
import styles from "./NavItem.module.css";

export function NavItem({ to, icon: Icon, label, collapsed, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        isActive ? `${styles.item} ${styles.active}` : styles.item
      }
      title={collapsed ? label : undefined}
    >
      <Icon className={styles.icon} aria-hidden="true" />
      {!collapsed && <span className={styles.label}>{label}</span>}
    </NavLink>
  );
}
