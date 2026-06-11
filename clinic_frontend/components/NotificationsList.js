"use client";

import { useEffect, useRef } from "react";
import Alert from "@/components/Alert";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotificationTypeBadge from "@/components/NotificationTypeBadge";
import { formatDate, formatTime } from "@/lib/api";

export default function NotificationsList({
  notifications,
  loading,
  error,
  onDismissError,
  onMarkAllAsRead,
  onDelete,
  autoMarkReadOnOpen = false,
}) {
  const autoMarkedRef = useRef(false);

  useEffect(() => {
    if (!autoMarkReadOnOpen || loading || autoMarkedRef.current) return;

    const hasUnread = notifications.some((n) => !n.is_read);
    if (hasUnread) {
      autoMarkedRef.current = true;
      onMarkAllAsRead();
    }
  }, [autoMarkReadOnOpen, loading, notifications, onMarkAllAsRead]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <p className="mb-6 text-sm text-muted">
        Alerts appear here and are also sent to your registered email when
        appointments are booked, updated, cancelled, or due within 24 hours.
      </p>

      <Alert message={error} onClose={onDismissError} />

      {notifications.length === 0 ? (
        <div className="card py-12 text-center text-muted">
          <span className="mb-3 block text-4xl">🔔</span>
          No notifications yet. They will appear when appointments are booked,
          updated, or coming up soon.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`card flex items-start justify-between gap-4 ${
                !notif.is_read ? "border-l-4 border-l-teal-500" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <NotificationTypeBadge type={notif.notification_type} />
                  {!notif.is_read && (
                    <span className="badge bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                      New
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-heading">{notif.title}</h3>
                <p className="mt-1 text-sm text-body">{notif.message}</p>
                <p className="mt-2 text-xs text-faint">
                  {formatDate(notif.created_at)}
                  {notif.created_at?.includes("T") &&
                    ` at ${formatTime(notif.created_at.split("T")[1]?.slice(0, 8))}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => onDelete(notif.id)}
                  className="btn-danger text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
