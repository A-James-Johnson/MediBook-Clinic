export default function StatusBadge({ status }) {
  const map = {
    PENDING: "badge badge-pending",
    CONFIRMED: "badge badge-confirmed",
    CANCELLED: "badge badge-cancelled",
    COMPLETED: "badge badge-completed",
  };

  return (
    <span className={map[status] || "badge bg-surface-muted text-body"}>
      {status}
    </span>
  );
}
