export default function Alert({ type = "error", message, onClose }) {
  if (!message) return null;

  const styles = {
    error: "alert-error",
    success: "alert-success",
    info: "alert-info",
  };

  return (
    <div
      className={`mb-4 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 shrink-0 opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
