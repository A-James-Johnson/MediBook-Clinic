export default function StatCard({ title, value, subtitle, icon, color = "teal" }) {
  const colors = {
    teal: "stat-icon-teal",
    blue: "stat-icon-blue",
    amber: "stat-icon-amber",
    emerald: "stat-icon-emerald",
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold text-heading">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${colors[color]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
