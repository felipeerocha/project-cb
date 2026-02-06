"use client";

import { useEffect, useState } from "react";
import {
  Store,
  Users,
  CalendarCheck,
  CheckCircle2,
  Utensils,
  ChefHat,
  Loader2,
  TrendingUp,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { dashboardService } from "@/services/dashboard-service";
import { MetricCard } from "./metric-card";
import { StatusBar } from "../ui/status-widgets";

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUnidades: 0,
    totalUsers: 0,
    totalReservas: 0,
    chartData: [] as any[],
    statusDistrib: { aprovadas: 0, analise: 0, reprovadas: 0 },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await dashboardService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#eea13e] h-10 w-10" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Unidades Cadastradas"
          value={stats.totalUnidades}
          percentage="Ativas"
          icon={Store}
          color="orange"
        />
        <MetricCard
          title="Clientes Cadastrados"
          value={stats.totalUsers}
          percentage="Total"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Total de Reservas"
          value={stats.totalReservas}
          percentage="Histórico"
          icon={CalendarCheck}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#472017] flex items-center gap-2">
              <TrendingUp size={18} className="text-[#eea13e]" />
              Evolução Diária de Reservas
            </h3>
            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full">
              Últimos 7 dias
            </span>
          </div>

          <div className="flex-1 w-full min-h-0">
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorReservas"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#eea13e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#eea13e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    cursor={{
                      stroke: "#eea13e",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Reservas"
                    stroke="#eea13e"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorReservas)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
                Aguardando dados de reservas...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-[#472017] mb-6 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" /> Status
              Global
            </h3>
            <div className="space-y-4">
              <StatusBar
                label="Aprovadas"
                count={stats.statusDistrib.aprovadas}
                total={stats.totalReservas}
                color="bg-green-500"
              />
              <StatusBar
                label="Em Análise"
                count={stats.statusDistrib.analise}
                total={stats.totalReservas}
                color="bg-amber-400"
              />
              <StatusBar
                label="Reprovadas"
                count={stats.statusDistrib.reprovadas}
                total={stats.totalReservas}
                color="bg-red-400"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#472017] to-[#2a100b] p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden h-[220px]">
            <div className="absolute top-[-50%] right-[-50%] w-64 h-64 bg-[#eea13e] rounded-full blur-[80px] opacity-20" />
            <Utensils className="absolute bottom-[-10px] right-[-10px] text-white/5 w-32 h-32 rotate-12" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-block bg-[#eea13e] text-[#472017] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20">
                  Em Breve
                </span>
                <ChefHat className="text-white/40" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold leading-tight">
                  Cardápios <br />{" "}
                  <span className="text-[#eea13e]">Sincronizados</span>
                </h3>
                <p className="text-white/60 text-xs mt-2 leading-relaxed">
                  Atualize preços e disponibilidade de pratos em todas as
                  unidades com um único clique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
