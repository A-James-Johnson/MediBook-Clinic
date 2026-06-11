"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import NotificationToast from "@/components/NotificationToast";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const notif = useNotifications();
  const prevUnreadRef = useRef(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (
      notif.unreadCount > prevUnreadRef.current &&
      notif.notifications.length > 0
    ) {
      const newestUnread = notif.notifications.find((n) => !n.is_read);
      if (newestUnread) {
        setToast(newestUnread);
      }
    }
    prevUnreadRef.current = notif.unreadCount;
  }, [notif.unreadCount, notif.notifications]);

  return (
    <NotificationContext.Provider value={notif}>
      {children}
      <NotificationToast
        notification={toast}
        onClose={() => setToast(null)}
      />
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }
  return context;
}

