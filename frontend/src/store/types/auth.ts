import { Connection } from "rest/constants";
export interface AuthState {
  isAuthenticated: boolean;
  connections: Connection[];
  tokens: { [key: string]: string | null };
}