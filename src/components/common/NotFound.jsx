import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import styles from "./NotFound.module.css";

export function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>This page doesn&rsquo;t exist.</p>
      <Link className={styles.link} to={ROUTES.dashboard()}>
        Back to dashboard
      </Link>
    </div>
  );
}
