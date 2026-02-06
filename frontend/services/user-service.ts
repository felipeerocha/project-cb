import api from "@/services/api";
import { User, UserFormData } from "@/types/user";

export const userService = {
  getAll: async (
    page = 1,
    limit = 10,
    search = "",
    sort = "nome",
  ): Promise<{ data: User[]; total: number }> => {
    const { data } = await api.get<{ data: User[]; total: number }>(
      `/users/?page=${page}&limit=${limit}&q=${search}&sort=${sort}`,
    );
    return data;
  },

  create: async (userData: UserFormData): Promise<User> => {
    const { data } = await api.post<User>("/users/", userData);
    return data;
  },

  update: async (
    id: string,
    userData: Partial<UserFormData>,
  ): Promise<User> => {
    const { data } = await api.patch<User>(`/users/${id}`, userData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  updatePhoto: async (id: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("foto", file);

    const { data } = await api.put(`/users/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
