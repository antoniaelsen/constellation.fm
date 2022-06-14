import { Connection } from "rest/constants";


export const auth = (set, get) => {
  return {
    auth: {
      connections: [],
      isAuthenticated: false,
      tokens: {},
      clearTokens: () => set((prev) => { auth: { tokens: {} }}),
      setAuthentication: (isAuthenticated: boolean) =>
        set((prev) => { prev.auth.isAuthenticated = isAuthenticated}),
      updateConnections: (connections: Connection[]) =>
        set((prev) => { prev.auth.connections = connections }),
      updateTokens: (tokens: Connection[]) =>
        set((prev) => ({ tokens: {...prev.auth.tokens, ...tokens }})),
    },
  }
};
