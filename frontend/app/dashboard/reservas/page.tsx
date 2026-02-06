"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

import { reservaService } from "@/services/reserva-service";

import { ReservasTable } from "@/components/reservas/reservas-table";
import { ReservaFormDialog } from "@/components/reservas/reserva-form-dialog";
import { ReproveReservaDialog } from "@/components/reservas/reprove-reserva-dialog";

const FILTROS = [
  { label: "Todos", value: "TODOS" },
  { label: "Em Análise", value: "EM_ANALISE" },
  { label: "Aprovadas", value: "APROVADO" },
  { label: "Reprovadas", value: "REPROVADO" },
];

export default function ReservasPage() {
  const { user } = useAuth();

  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [sortField, setSortField] = useState("data_reserva");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reservaEditando, setReservaEditando] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [isReproveModalOpen, setIsReproveModalOpen] = useState(false);
  const [reservaToReprove, setReservaToReprove] = useState<any>(null);
  const [reproving, setReproving] = useState(false);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const sortParam = sortDirection === "desc" ? `-${sortField}` : sortField;

      const { data, total } = await reservaService.getAll({
        page,
        limit,
        status: statusFilter,
        sort: sortParam,
      });

      setReservas(data || []);
      setTotal(total || 0);
    } catch (error) {
      toast.error("Erro ao carregar reservas");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [statusFilter, page, sortField, sortDirection]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleNovaReserva = () => {
    setReservaEditando(null);
    setIsFormOpen(true);
  };

  const handleEditarReserva = (reserva: any) => {
    setReservaEditando(reserva);
    setIsFormOpen(true);
  };

  const handleSaveReserva = async (formData: any) => {
    setSaving(true);
    try {
      if (reservaEditando) {
        await reservaService.update(reservaEditando.id, formData);
        toast.success("Reserva atualizada com sucesso!");
      } else {
        await reservaService.create(formData);
        toast.success("Reserva solicitada com sucesso!");
      }

      setIsFormOpen(false);
      setReservaEditando(null);
      fetchReservas();
    } catch (error: any) {
      console.error(error);
      let msg = "Erro ao processar reserva.";
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === "string") msg = detail;
        else if (Array.isArray(detail))
          msg = detail[0]?.msg || "Erro de validação.";
      }
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChangeClick = async (reserva: any, novoStatus: string) => {
    if (novoStatus === "REPROVADO") {
      setReservaToReprove(reserva);
      setIsReproveModalOpen(true);
    } else {
      await updateReservaStatus(reserva.id, novoStatus);
    }
  };

  const updateReservaStatus = async (
    id: string,
    status: string,
    motivo: string | null = null,
  ) => {
    try {
      await reservaService.updateStatus(id, status, motivo);

      toast.success(
        `Reserva ${status === "APROVADO" ? "aprovada" : "reprovada"} com sucesso!`,
      );
      fetchReservas();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao atualizar status";
      toast.error(msg);
    }
  };

  const handleConfirmReprove = async (motivo: string) => {
    if (!reservaToReprove) return;
    setReproving(true);
    try {
      await updateReservaStatus(reservaToReprove.id, "REPROVADO", motivo);
      setIsReproveModalOpen(false);
      setReservaToReprove(null);
    } finally {
      setReproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#472017]">Reservas</h1>
          <p className="text-sm text-gray-500">
            Acompanhe as solicitações de clientes em tempo real.
          </p>
        </div>

        <Button
          onClick={handleNovaReserva}
          className="bg-[#eea13e] text-[#472017] hover:bg-[#d68b2d] font-bold shadow-md shadow-orange-500/20 h-10 px-4 rounded-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Reserva
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {FILTROS.map((filtro) => (
            <button
              key={filtro.value}
              onClick={() => setStatusFilter(filtro.value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                statusFilter === filtro.value
                  ? "bg-[#472017] text-[#eea13e] shadow-md ring-2 ring-[#472017]/10"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#472017]"
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </div>
      </div>

      <ReservasTable
        reservas={reservas}
        onView={handleEditarReserva}
        onStatusChange={handleStatusChangeClick}
        isAdmin={user?.is_superuser || false}
        loading={loading}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSort}
      />

      <ReservaFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setReservaEditando(null);
        }}
        onSave={handleSaveReserva}
        isLoading={saving}
        isAdmin={user?.is_superuser || false}
        reservaToEdit={reservaEditando}
      />

      <ReproveReservaDialog
        isOpen={isReproveModalOpen}
        onClose={() => {
          setIsReproveModalOpen(false);
          setReservaToReprove(null);
        }}
        onConfirm={handleConfirmReprove}
        isLoading={reproving}
      />
    </div>
  );
}
