"use client";

import NotificationsList from "@/components/NotificationsList";
import { useNotificationContext } from "@/context/NotificationContext";

export default function DoctorNotificationsPage() {
  const {
    notifications,
    loading,
    error,
    setError,
    markAllAsRead,
    deleteNotification,
  } = useNotificationContext();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-heading">Notifications</h1>
      <NotificationsList
        notifications={notifications}
        loading={loading}
        error={error}
        onDismissError={() => setError("")}
        onMarkAllAsRead={markAllAsRead}
        onDelete={deleteNotification}
        autoMarkReadOnOpen
      />
    </div>
  );
}
