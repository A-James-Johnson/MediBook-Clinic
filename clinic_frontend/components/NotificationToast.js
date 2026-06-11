"use client";

import { useEffect, useRef } from "react";
import { getNotificationIcon } from "@/components/NotificationTypeBadge";

export default function NotificationToast({ notification, onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, 6000);
    return () => clearTimeout(timerRef.current);
  }, [onClose]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-[slideUp_0.3s_ease-out]">
      <div className="toast-panel border-teal-200 dark:border-teal-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl">
            {getNotificationIcon(notification.notification_type)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-heading">
              {notification.title}
            </p>
            <p className="mt-1 text-xs text-body line-clamp-2">
              {notification.message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-faint hover:text-body"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
