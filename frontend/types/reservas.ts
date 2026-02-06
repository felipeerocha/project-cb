import { User } from "./user";
import { Unidade } from "./unidade";

export type StatusReserva = "EM_ANALISE" | "APROVADO" | "REPROVADO";

export interface Reserva {
  id: string;
  data_reserva: string;
  qtd_pessoas: number;
  itens_cardapio?: any[] | null;
  status: StatusReserva;
  motivo_reprovacao?: string | null;
  created_at: string;

  user_id: string;
  unidade_id: string;

  usuario?: User;
  unidade?: Unidade;

  user?: {
    nome: string;
    email: string;
    foto_url?: string;
  };
}

export interface ReservaFormData {
  unidade_id: string;
  data_reserva: string;
  qtd_pessoas: number;
  itens_cardapio?: any[];
}
