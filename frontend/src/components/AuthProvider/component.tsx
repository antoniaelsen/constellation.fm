import React, { createContext, useCallback, useContext, useEffect } from "react";
import cookies from "js-cookie";
import config from "config";
import { Service } from "lib/constants";

const COOKIE_KEY_AUTH_STATE = "cfm-auth";
const COOKIE_KEY_TOKEN_PREFIX = `${COOKIE_KEY_AUTH_STATE}-token`;
const COOKIE_KEY_TOKENS = ["spotifyplayback"];

type Tokens = {
  [key: string]: string | null;
};

const clearCookies = () => {
  cookies.remove(COOKIE_KEY_AUTH_STATE);
  COOKIE_KEY_TOKENS.forEach((key) => {
    cookies.remove(`${COOKIE_KEY_TOKEN_PREFIX}-${key}`);
  });
}

const parseAccessTokens = () => {
  const tokens: Tokens = {};
  COOKIE_KEY_TOKENS.forEach((service) => {
    const key = `${COOKIE_KEY_TOKEN_PREFIX}-${service}`;
    const token = cookies.get(key);
    if (!token) return;
    tokens[service] = token;
    cookies.remove(key);
  });
  return tokens;
};

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: JSX.Element | JSX.Element[];
  isAuthenticated: boolean;
  tokens: Tokens;
  clearTokens: () => void;
  setAuthentication: (state: boolean) => void;
  updateConnections: (connections: Service[]) => void;
  updateTokens: (tokens: Tokens) => void;
}

export const AuthProvider = (props: AuthProviderProps) => {
  const { children, isAuthenticated, clearTokens, updateConnections, updateTokens, setAuthentication } = props;

  const clearAuthState = useCallback(() => {
    setAuthentication(false);
    updateConnections([]);
    clearTokens();
    clearCookies();
  }, [clearTokens, updateConnections, setAuthentication]);
  
  const getAuthState = useCallback(() => {
    const authStateStr = cookies.get(COOKIE_KEY_AUTH_STATE);
    if (!authStateStr) {
      return;
    }
    const authState = JSON.parse(authStateStr);
    setAuthentication(authState.isLoggedIn);
    updateConnections(authState.connections);
  }, [setAuthentication, updateConnections]);

  const getTokens = useCallback(async () => {
    try {
      const res = await fetch(`${config.api.backend}/auth`, { credentials: "include" });
      if (res.status === 401) {
        clearAuthState();
        return;
      }
      
      const tokens = parseAccessTokens();
      updateTokens(tokens);
    } catch (e) {
      clearAuthState();
    }
  }, [clearAuthState, updateTokens]);

  const login = useCallback(() => {
    const redirectUri = `${config.api.backend}/auth/auth0?returnTo=${
      window.location.href
    }`;
    window.location.href = redirectUri;
  }, []);

  const logout = useCallback(() => {
    const redirectUri = `${config.api.backend}/auth/logout?returnTo=${
      window.location.href
    }`;
    window.location.href = redirectUri;
  }, []);

  useEffect(() => {
    getTokens();
    getAuthState();
  }, [getAuthState, getTokens]);


  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
};