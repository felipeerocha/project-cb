"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  User,
  Clock,
  Utensils,
  Pencil,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReservasTableProps {
  reservas: any[];
  total: number;
  page: number;
  limit: number;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
  onPageChange: (page: number) => void;
  onView: (reserva: any) => void;
  onStatusChange: (reserva: any, status: string) => void;
  isAdmin: boolean;
  loading?: boolean;
}

export function ReservasTable({
  reservas,
  total,
  page,
  limit,
  sortField,
  sortDirection,
  onSortChange,
  onPageChange,
  onView,
  onStatusChange,
  isAdmin,
  loading,
}: ReservasTableProps) {
  const totalPages = Math.ceil(total / limit);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APROVADO":
        return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100";
      case "REPROVADO":
        return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "EM_ANALISE":
        return "Em Análise";
      case "APROVADO":
        return "Aprovada";
      case "REPROVADO":
        return "Reprovada";
      default:
        return status;
    }
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
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <SortableHead field="data_reserva" label="Data & Hora" />
              <SortableHead field="usuario.nome" label="Cliente" />
              <SortableHead field="unidade.nome" label="Unidade" />
              <TableHead className="font-bold text-[#472017]">
                Detalhes
              </TableHead>
              <SortableHead field="status" label="Status" />
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
                    colSpan={6}
                    className="h-16 animate-pulse bg-gray-50/50"
                  />
                </TableRow>
              ))
            ) : reservas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-gray-400"
                >
                  Nenhuma reserva encontrada.
                </TableCell>
              </TableRow>
            ) : (
              reservas.map((reserva) => (
                <TableRow
                  key={reserva.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#eea13e]" />
                        {format(new Date(reserva.data_reserva), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {reserva.horario_reserva ||
                          format(new Date(reserva.data_reserva), "HH:mm")}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#eea13e]" />
                        {reserva.usuario?.nome || "Cliente não identificado"}
                      </span>
                      <span className="text-[10px] text-gray-400 pl-5 truncate max-w-[150px]">
                        {reserva.usuario?.email || "Sem e-mail"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {reserva.unidade?.nome}
                      </span>
                      <span className="text-[10px] text-gray-400 pl-5 truncate max-w-[150px]">
                        {reserva.unidade?.regiao}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant="secondary"
                        className="w-fit text-[10px] h-5 bg-gray-100 text-gray-600 border-none"
                      >
                        {reserva.qtd_pessoas} Pessoas
                      </Badge>
                      {reserva.itens_cardapio &&
                        reserva.itens_cardapio.length > 0 && (
                          <div
                            className="flex items-center gap-1 text-[10px] text-gray-500 font-medium"
                            title={reserva.itens_cardapio.join(", ")}
                          >
                            <Utensils className="w-3 h-3 text-[#eea13e]" />
                            <span className="truncate max-w-[120px]">
                              {reserva.itens_cardapio.length} itens do menu
                            </span>
                          </div>
                        )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(reserva.status)} font-bold px-2 py-0.5 shadow-sm border-0`}
                    >
                      {formatStatus(reserva.status)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    {reserva.status === "REPROVADO" ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                          >
                            <AlertTriangle className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-80 bg-white border-amber-200 shadow-lg p-0 overflow-hidden"
                          align="end"
                        >
                          <div className="bg-amber-50 p-3 border-b border-amber-100 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="font-bold text-amber-900 text-sm">
                              Reserva Reprovada
                            </span>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                                Motivo:
                              </p>
                              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                {reserva.motivo_reprovacao ||
                                  "Nenhum motivo informado."}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onView(reserva)}
                              className="w-full text-xs h-8 border-dashed"
                            >
                              <Eye className="w-3 h-3 mr-2" /> Ver dados da
                              reserva
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
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
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>
                            Gerenciar Reserva
                          </DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() => onView(reserva)}
                            className="cursor-pointer font-medium"
                          >
                            {reserva.status === "EM_ANALISE" ? (
                              <>
                                {" "}
                                <Pencil className="mr-2 h-4 w-4 text-amber-600" />{" "}
                                Editar Reserva{" "}
                              </>
                            ) : (
                              <>
                                {" "}
                                <Eye className="mr-2 h-4 w-4 text-blue-600" />{" "}
                                Ver Detalhes{" "}
                              </>
                            )}
                          </DropdownMenuItem>

                          {isAdmin && reserva.status === "EM_ANALISE" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  onStatusChange(reserva, "APROVADO")
                                }
                                className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer font-medium"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
                                Solicitação
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onStatusChange(reserva, "REPROVADO")
                                }
                                className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
                              >
                                <XCircle className="mr-2 h-4 w-4" /> Reprovar
                                Solicitação
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-gray-500 font-medium">
          Mostrando <strong>{reservas.length}</strong> de{" "}
          <strong>{total}</strong> reservas
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
