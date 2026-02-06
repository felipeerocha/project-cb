"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Store,
  Users,
  CheckCircle2,
  CalendarDays,
  Clock,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { dashboardService } from "@/services/dashboard-service";
import { MetricCard } from "./metric-card";
import { StatusBadge } from "@/components/ui/status-widgets";

export function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    aprovadas: 0,
    analise: 0,
    reprovadas: 0,
    recentes: [] as any[],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await dashboardService.getClientStats();
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar dados do cliente", error);
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-6">
        <MetricCard
          title="Minhas Reservas"
          value={stats.total}
          percentage="Histórico"
          icon={CalendarCheck}
          color="orange"
        />

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-[#472017] mb-2">Status dos Pedidos</h3>
          <p className="text-xs text-gray-500 mb-6">
            Acompanhe a aprovação das suas solicitações.
          </p>

          <div className="flex gap-2 h-4 rounded-full overflow-hidden mb-4 bg-slate-100">
            {stats.total > 0 && (
              <>
                <div
                  className="bg-green-500"
                  style={{ width: `${(stats.aprovadas / stats.total) * 100}%` }}
                  title="Aprovadas"
                />
                <div
                  className="bg-amber-400"
                  style={{ width: `${(stats.analise / stats.total) * 100}%` }}
                  title="Em Análise"
                />
                <div
                  className="bg-red-400"
                  style={{
                    width: `${(stats.reprovadas / stats.total) * 100}%`,
                  }}
                  title="Reprovadas"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <StatusBadge
              count={stats.aprovadas}
              label="Aprovadas"
              color="green"
            />
            <StatusBadge
              count={stats.analise}
              label="Em Análise"
              color="amber"
            />
            <StatusBadge
              count={stats.reprovadas}
              label="Reprovadas"
              color="red"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#472017] flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#eea13e]" /> Últimas
            Aprovadas
          </h3>
        </div>

        <div className="space-y-4">
          {stats.recentes.map((reserva) => (
            <div
              key={reserva.id}
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#eea13e]/30 hover:bg-orange-50/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-[#472017]/5 text-[#472017] flex items-center justify-center group-hover:bg-[#eea13e] group-hover:text-[#472017] transition-colors">
                  <Store size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {reserva.unidade?.nome}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {format(new Date(reserva.data_reserva), "dd/MM/yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {reserva.horario_reserva}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  <Users size={12} /> {reserva.qtd_pessoas} Pessoas
                </span>
              </div>
            </div>
          ))}

          {stats.recentes.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">
              Nenhuma reserva aprovada recentemente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
