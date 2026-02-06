interface MetricCardProps {
  title: string;
  value: string | number;
  percentage: string;
  icon: any;
  color: "orange" | "emerald" | "blue" | "red";
}

export function MetricCard({
  title,
  value,
  percentage,
  icon: Icon,
  color,
}: MetricCardProps) {
  const bgColors = {
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl ${bgColors[color]}`}>
          <Icon size={18} />
        </div>
        <span className="flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500">
          {percentage}
        </span>
      </div>
      <div>
        <h3 className="text-2xl font-black text-[#472017] mt-2 tracking-tight">
          {value}
        </h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          {title}
        </p>
      </div>
    </div>
  );
}
