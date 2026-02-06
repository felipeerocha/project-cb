"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { userService } from "@/services/user-service";

import { UsersTable } from "@/components/users/users-table";
import { UserFormDialog } from "@/components/users/user-form-dialog";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { User } from "@/types/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const sortParam = sortDirection === "desc" ? `-${sortField}` : sortField;

      const { data, total } = await userService.getAll(
        page,
        limit,
        searchTerm,
        sortParam,
      );

      setUsers(data || []);
      setTotal(total || 0);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await userService.delete(userToDelete.id);
      toast.success("Usuário removido com sucesso");
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Erro ao excluir usuário");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      if (editingUser) {
        const payload = { ...data };
        if (!payload.password) delete payload.password;

        await userService.update(editingUser.id, payload);
        toast.success("Usuário atualizado!");
      } else {
        await userService.create(data);
        toast.success("Usuário criado!");
      }
      setIsFormOpen(false);
      fetchUsers();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao salvar";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#472017]">
            Gerenciar Clientes
          </h1>
          <p className="text-sm text-gray-500">
            Administre o acesso e permissões do sistema.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-[#eea13e] text-[#472017] hover:bg-[#d68b2d] font-bold shadow-md shadow-orange-500/20 h-10 px-4 rounded-md"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:ring-[#eea13e]/20 transition-all h-10 rounded-lg"
          />
        </div>
      </div>

      <UsersTable
        users={users}
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

      <UserFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        userToEdit={editingUser}
        isLoading={saving}
      />

      <ConfirmDeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Usuário"
        description={`Deseja excluir permanentemente o cliente "${userToDelete?.nome}"?`}
        isLoading={deleting}
      />
    </div>
  );
}
