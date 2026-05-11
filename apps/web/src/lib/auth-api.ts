import axios from "axios";

import { api } from "./api";

type LoginSession = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: string };
};

const demoUsers = [
  { id: "u-founder", email: "antoniwelh@gmail.com", password: "Anthony45", role: "SUPER_ADMIN" },
  { id: "u-manager", email: "admin@restomaster.dev", password: "Demo12345!", role: "MANAGER" }
];

export async function login(email: string, password: string): Promise<LoginSession> {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    return data as LoginSession;
  } catch (error) {
    const canFallback = axios.isAxiosError(error) && (!error.response || error.response.status >= 500);
    if (canFallback) {
      const match = demoUsers.find((user) => user.email === email && user.password === password);
      if (match) {
        return {
          accessToken: `demo-access-${Date.now()}`,
          refreshToken: `demo-refresh-${Date.now()}`,
          user: { id: match.id, email: match.email, role: match.role }
        };
      }
    }
    throw error;
  }
}
