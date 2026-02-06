"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { unidadeService } from "@/services/unidade-service";

import { UnidadesTable } from "@/components/unidades/unidades-table";
import { UnidadeFormDialog } from "@/components/unidades/unidade-form-dialog";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { Unidade } from "@/types/unidade";

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingUnidade, setEditingUnidade] = useState<Unidade | null>(null);
  const [unidadeToDelete, setUnidadeToDelete] = useState<Unidade | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchUnidades = async () => {
    setLoading(true);
    try {
      const sortParam = sortDirection === "desc" ? `-${sortField}` : sortField;

      const { data, total } = await unidadeService.getAll(
        page,
        limit,
        searchTerm,
        sortParam,
      );

      setUnidades(data);
      setTotal(total);
    } catch (error) {
      toast.error("Erro ao carregar unidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnidades();
  }, [page, searchTerm, sortField, sortDirection]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (unidade: Unidade) => {
    setEditingUnidade(unidade);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (unidade: Unidade) => {
    setUnidadeToDelete(unidade);
    const temReservaPendente = unidade.reservas?.some(
      (r) => r.status === "EM_ANALISE",
    );

    if (temReservaPendente) {
      setIsBlocked(true);
      setBlockReason(
        "Existem reservas 'Em Análise' vinculadas a esta unidade. Aprove ou cancele as reservas antes de excluir.",
      );
    } else {
      setIsBlocked(false);
      setBlockReason("");
    }
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!unidadeToDelete) return;
    setDeleting(true);
    try {
      await unidadeService.delete(unidadeToDelete.id);
      toast.success("Unidade excluída com sucesso!");
      setIsDeleteModalOpen(false);
      fetchUnidades();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao excluir unidade.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      if (editingUnidade) {
        await unidadeService.update(editingUnidade.id, data);
        toast.success("Unidade atualizada!");
      } else {
        await unidadeService.create(data);
        toast.success("Unidade criada!");
      }
      setIsFormOpen(false);
      fetchUnidades();
    } catch (error) {
      toast.error("Erro ao salvar unidade.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#472017]">Unidades</h1>
          <p className="text-sm text-gray-500">
            Gerencie as filiais e locais de atendimento.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUnidade(null);
            setIsFormOpen(true);
          }}
          className="bg-[#eea13e] text-[#472017] hover:bg-[#d68b2d] font-bold shadow-md shadow-orange-500/20 h-10 px-4 rounded-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Unidade
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar unidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[#eea13e]/20 transition-all h-10 rounded-lg"
          />
        </div>
      </div>

      <UnidadesTable
        unidades={unidades}
        total={total}
        page={page}
        limit={limit}
        sortField={sortField}
        sortDirection={sortDirection}
        onPageChange={setPage}
        onSortChange={handleSort}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      <UnidadeFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        unidadeToEdit={editingUnidade}
        isLoading={saving}
      />

      <ConfirmDeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Unidade"
        description={`Deseja excluir permanentemente a unidade "${unidadeToDelete?.nome}"?`}
        isLoading={deleting}
        isBlocked={isBlocked}
        reason={blockReason}
      />
    </div>
  );
}
