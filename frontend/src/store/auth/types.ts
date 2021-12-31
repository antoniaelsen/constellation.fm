export interface AuthState {
  isAuthenticated: boolean,
  tokens: { [key: string]: string | null }
}