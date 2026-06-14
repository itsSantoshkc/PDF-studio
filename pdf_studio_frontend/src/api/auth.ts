import client from "./client";
import type { User, AuthTokens, LoginCredentials, RegisterData } from "@/types/api";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await client.post("/auth/login/", credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await client.post("/auth/register/", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await client.get("/auth/profile/");
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await client.patch("/auth/profile/", data);
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await client.put("/auth/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  logout: async (refreshToken: string): Promise<void> => {
    await client.post("/auth/logout/", { refresh: refreshToken });
  },

  deleteAccount: async (): Promise<void> => {
    await client.delete("/auth/delete-account/");
  },
};
