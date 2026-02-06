import { Reserva } from "./reservas";

export interface Unidade {
  id: string;
  nome: string;
  regiao: string;
  endereco: string;
  cep: string;
  CEP?: string;
  foto_url?: string | null;
  latitude: number;
  longitude: number;
  reservas?: Reserva[];
}

export interface UnidadeFormData {
  nome: string;
  regiao: string;
  cep: string;
  endereco: string;
  foto_url?: string;
  latitude?: number;
  longitude?: number;
}
