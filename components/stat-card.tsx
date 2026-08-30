/**
 * Stat Card
 *
 * Metric panel with label, value, and optional trend.
 */

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({
  label,
  value,
  description,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div className="panel rounded-xl p-4 sm:p-5">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      {description && <p className="mt-1 text-xs text-muted">{description}</p>}
      {trend && (
        <p
          className={`mt-1 text-xs tabular-nums ${trendUp ? "text-success" : "text-error"}`}
        >
          {trendUp ? "Up" : "Down"} {trend}
        </p>
      )}
    </div>
  );
}
