import styles from "./SearchResultItem.module.css";

export function SearchResultItem({ icon: Icon, iconColor, title, subtitle, onClick }) {
  return (
    <button type="button" className={styles.item} onClick={onClick}>
      <span className={styles.iconWrap} style={iconColor ? { background: iconColor } : undefined}>
        <Icon className={styles.icon} aria-hidden="true" />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
    </button>
  );
}
