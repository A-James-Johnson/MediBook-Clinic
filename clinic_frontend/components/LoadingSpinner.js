export default function LoadingSpinner({ size = "md" }) {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 dark:border-teal-800 dark:border-t-teal-400`}
      />
    </div>
  );
}
