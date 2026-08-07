import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Calendar, UserPlus, AtSign } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useNotifications } from "../../hooks/useNotifications";
import { useUI } from "../../contexts/UIContext";
import { EmptyState } from "../common/EmptyState";
import { formatRelativeTime } from "../../utils/date";
import { ROUTES } from "../../constants/routes";
import styles from "./NotificationsPanel.module.css";

const ICONS = { due: Calendar, assigned: UserPlus, mention: AtSign };

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, useCallback(() => setOpen(false), []));

  const notifications = useNotifications();
  const { notificationsLastSeenAt, markNotificationsSeen } = useUI();
  const navigate = useNavigate();

  const unreadCount = notificationsLastSeenAt
    ? notifications.filter((n) => new Date(n.createdAt) > new Date(notificationsLastSeenAt)).length
    : notifications.length;

  function handleToggle() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) markNotificationsSeen();
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.trigger}
        onClick={handleToggle}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell aria-hidden="true" />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {open && (
        <div className={styles.menu}>
          <h2 className={styles.title}>Notifications</h2>
          {notifications.length > 0 ? (
            <ul className={styles.list}>
              {notifications.map((notification) => {
                const Icon = ICONS[notification.type];
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      className={styles.item}
                      onClick={() => {
                        setOpen(false);
                        navigate(ROUTES.board(notification.board.id), {
                          state: { openCardId: notification.card.id },
                        });
                      }}
                    >
                      <Icon className={styles.icon} aria-hidden="true" />
                      <span className={styles.text}>
                        <span className={styles.message}>
                          {notification.message} <strong>{notification.card.title}</strong>
                        </span>
                        <span className={styles.meta}>
                          {notification.board.name} · {formatRelativeTime(notification.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title="You're all caught up" description="No notifications right now." />
          )}
        </div>
      )}
    </div>
  );
}
