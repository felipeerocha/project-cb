import React from "react";

export function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-900 font-bold">
          {percentage}% ({count})
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function StatusBadge({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: "green" | "amber" | "red";
}) {
  const colors = {
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <div
      className={`flex flex-col items-center justify-center p-3 rounded-xl border ${colors[color]}`}
    >
      <span className="text-xl font-bold">{count}</span>
      <span className="text-[10px] uppercase font-bold opacity-80">
        {label}
      </span>
    </div>
  );
}
