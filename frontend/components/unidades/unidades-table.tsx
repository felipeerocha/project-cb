"use client";

import {
  Pencil,
  Trash2,
  MapPin,
  Hash,
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Unidade } from "@/types/unidade";
import { cn } from "@/lib/utils";

interface UnidadesTableProps {
  unidades: Unidade[];
  total: number;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: "asc" | "desc";
  onEdit: (unidade: Unidade) => void;
  onDelete: (unidade: Unidade) => void;
  onPageChange: (newPage: number) => void;
  onSortChange: (field: string) => void;
  loading?: boolean;
}

export function UnidadesTable({
  unidades,
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
}: UnidadesTableProps) {
  const totalPages = Math.ceil(total / limit);

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${baseURL}${url}`;
  };

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
    width,
  }: {
    field: string;
    label: string;
    width?: string;
  }) => (
    <TableHead
      className={cn(
        "font-bold text-[#472017] cursor-pointer hover:bg-gray-100 transition-colors select-none",
        width,
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
              <TableHead className="w-[80px] font-bold text-[#472017]">
                Fachada
              </TableHead>
              <SortableHead field="nome" label="Unidade" />
              <SortableHead field="regiao" label="Localização" />
              <SortableHead field="cep" label="CEP" width="w-[150px]" />
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
                    colSpan={5}
                    className="h-16 animate-pulse bg-gray-50/50"
                  />
                </TableRow>
              ))
            ) : unidades.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-400"
                >
                  Nenhuma unidade encontrada.
                </TableCell>
              </TableRow>
            ) : (
              unidades.map((unidade) => (
                <TableRow
                  key={unidade.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <TableCell>
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-gray-100">
                      <AvatarImage
                        src={getImageUrl(unidade.foto_url)}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-[#472017] text-[#eea13e] font-bold text-xs">
                        {unidade.nome.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-gray-700">
                      {unidade.nome}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-600">
                        {unidade.regiao}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-[#eea13e]" />{" "}
                        {unidade.endereco}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs font-mono bg-orange-50 px-2 py-1 rounded border border-orange-100 text-orange-700 font-bold">
                      <Hash size={10} /> {unidade.cep || unidade.CEP}
                    </span>
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
                          onClick={() => onEdit(unidade)}
                          className="cursor-pointer font-medium"
                        >
                          <Pencil className="mr-2 h-4 w-4 text-amber-600" />{" "}
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(unidade)}
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
          Mostrando <strong>{unidades.length}</strong> de{" "}
          <strong>{total}</strong> registros
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
