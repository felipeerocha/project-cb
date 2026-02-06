import api from "@/services/api";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: any;
}

export const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    return data;
  },
};
