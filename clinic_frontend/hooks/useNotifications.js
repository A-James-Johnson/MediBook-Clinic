"use client";

import { useCallback, useEffect, useState } from "react";
import { notificationsApi } from "@/lib/api";

export function useNotifications(pollInterval = 30000) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await notificationsApi.list();
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotifications(sorted);
      setUnreadCount(sorted.filter((n) => !n.is_read).length);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => loadNotifications(true), pollInterval);
    return () => clearInterval(interval);
  }, [loadNotifications, pollInterval]);

  const markAsRead = useCallback(async (notif) => {
    await notificationsApi.update(notif.id, { ...notif, is_read: true });
    await loadNotifications(true);
  }, [loadNotifications]);

  const markAllAsRead = useCallback(async () => {
    await notificationsApi.markAllRead();
    await loadNotifications(true);
  }, [loadNotifications]);

  const deleteNotification = async (id) => {
    await notificationsApi.delete(id);
    await loadNotifications(true);
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    setError,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
