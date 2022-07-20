import { Service } from "lib/constants";
export interface AuthState {
  isAuthenticated: boolean;
  connections: Service[];
  tokens: { [key: string]: string | null };
}