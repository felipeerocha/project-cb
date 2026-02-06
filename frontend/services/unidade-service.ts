import api from "@/services/api";
import { Unidade } from "@/types/unidade";

export const unidadeService = {
  getAll: async (
    page = 1,
    limit = 10,
    search = "",
    sort = "nome",
  ): Promise<{ data: Unidade[]; total: number }> => {
    const { data } = await api.get<{ data: Unidade[]; total: number }>(
      `/unidades/?page=${page}&limit=${limit}&q=${search}&sort=${sort}`,
    );
    return data;
  },

  create: async (unidadeData: any): Promise<Unidade> => {
    const { data } = await api.post<Unidade>("/unidades/", unidadeData);
    return data;
  },

  update: async (id: string, unidadeData: any): Promise<Unidade> => {
    const { data } = await api.patch<Unidade>(`/unidades/${id}`, unidadeData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/unidades/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<{ url: string }>(
      "/unidades/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data.url;
  },
};
