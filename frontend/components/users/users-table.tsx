"use client";

import {
  Pencil,
  Trash2,
  MoreHorizontal,
  Mail,
  Phone,
  ShieldCheck,
  User as UserIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";

interface UsersTableProps {
  users: User[];
  total: number;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: "asc" | "desc";
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onPageChange: (newPage: number) => void;
  onSortChange: (field: string) => void;
  loading?: boolean;
}

export function UsersTable({
  users,
  total,
  page,
  limit,
  sortField,
  sortDirection,
  onEdit,
  onDelete,
  onPageChange,
  onSortChange,
  loading,
}: UsersTableProps) {
  const totalPages = Math.ceil(total / limit);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field)
      return <ArrowUpDown size={14} className="ml-2 text-gray-300" />;
    return sortDirection === "asc" ? (
      <ArrowUp size={14} className="ml-2 text-[#eea13e]" />
    ) : (
      <ArrowDown size={14} className="ml-2 text-[#eea13e]" />
    );
  };

  const SortableHead = ({
    field,
    label,
    className,
  }: {
    field: string;
    label: string;
    className?: string;
  }) => (
    <TableHead
      className={cn(
        "font-bold text-[#472017] cursor-pointer hover:bg-gray-100 transition-colors select-none",
        className,
      )}
      onClick={() => onSortChange(field)}
    >
      <div className="flex items-center">
        {label} <SortIcon field={field} />
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <SortableHead field="nome" label="Cliente" />
              <SortableHead field="email" label="Contato" />
              <SortableHead field="is_superuser" label="Permissão" />
              <TableHead className="text-right font-bold text-[#472017] w-[100px]">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    colSpan={4}
                    className="h-16 animate-pulse bg-gray-50/50"
                  />
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-gray-400"
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-gray-100">
                        <AvatarFallback className="bg-[#472017] text-[#eea13e] font-bold text-xs">
                          {user.nome.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700">
                          {user.nome}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        <Mail size={12} className="text-[#eea13e]" />{" "}
                        {user.email}
                      </div>
                      {user.telefone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                          <Phone size={12} /> {user.telefone}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {user.is_superuser ? (
                      <Badge
                        variant="secondary"
                        className="bg-purple-50 text-purple-700 border-purple-100 gap-1 hover:bg-purple-100"
                      >
                        <ShieldCheck size={12} /> Admin
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-gray-500 border-gray-200 gap-1"
                      >
                        <UserIcon size={12} /> Cliente
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-[#472017] hover:bg-[#eea13e]/20"
                        >
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onEdit(user)}
                          className="cursor-pointer font-medium"
                        >
                          <Pencil className="mr-2 h-4 w-4 text-amber-600" />{" "}
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(user)}
                          className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 font-medium"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-gray-500 font-medium">
          Mostrando <strong>{users.length}</strong> de <strong>{total}</strong>{" "}
          usuários
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-xs font-bold text-[#472017]">
            Página {page} de {totalPages || 1}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
