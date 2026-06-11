const TYPE_STYLES = {
  BOOKING: {
    label: "New Booking",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
  STATUS_UPDATE: {
    label: "Status Update",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  CANCELLATION: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
  REMINDER: {
    label: "Reminder",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
};

const TYPE_ICONS = {
  BOOKING: "📅",
  STATUS_UPDATE: "✅",
  CANCELLATION: "❌",
  REMINDER: "⏰",
};

export function getNotificationIcon(type) {
  return TYPE_ICONS[type] || "🔔";
}

export default function NotificationTypeBadge({ type }) {
  const style = TYPE_STYLES[type] || {
    label: "Notification",
    className: "bg-surface-muted text-body",
  };

  return (
    <span className={`badge ${style.className}`}>
      {getNotificationIcon(type)} {style.label}
    </span>
  );
}
