import api from "@/services/api";

export interface ReservaFilters {
  page: number;
  limit: number;
  status?: string;
  sort?: string;
}

export const reservaService = {
  getAll: async ({ page, limit, status, sort }: ReservaFilters) => {
    let query = `?page=${page}&limit=${limit}`;

    if (sort) query += `&sort=${sort}`;
    if (status && status !== "TODOS") query += `&status=${status}`;

    const { data } = await api.get<{ data: any[]; total: number }>(
      `/reservas/${query}`,
    );
    return data;
  },

  create: async (reservaData: any) => {
    const { data } = await api.post("/reservas/", reservaData);
    return data;
  },

  update: async (id: string, reservaData: any) => {
    const { data } = await api.patch(`/reservas/${id}`, reservaData);
    return data;
  },

  updateStatus: async (id: string, status: string, motivo?: string | null) => {
    const payload: any = { status };
    if (motivo) {
      payload.motivo_reprovacao = motivo;
    }
    const { data } = await api.patch(`/reservas/${id}/status`, payload);
    return data;
  },
};
