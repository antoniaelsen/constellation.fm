import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import cookies from "js-cookie";
import config from "config";
import { Connection } from "rest/constants";

const COOKIE_KEY_AUTH_STATE = "cfm-auth";
const COOKIE_KEY_TOKEN_PREFIX = `${COOKIE_KEY_AUTH_STATE}-token`;
const COOKIE_KEY_TOKENS = ["spotify-playback"];

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
  console.log("AuthProvider | Parsing ATs");
  const tokens: Tokens = {};
  COOKIE_KEY_TOKENS.forEach((connection) => {
    const key = `${COOKIE_KEY_TOKEN_PREFIX}-${connection}`;
    const token = cookies.get(key);
    if (!token) return;
    console.log(`Auth Provider | Got AT for ${key}, deleting cookie and storing in memory...`);
    tokens[connection] = token;
    cookies.remove(key);
  });
  console.log("AuthProvider | Got ATs:", tokens);
  return tokens;
};

interface AuthContextType {
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<any>({
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
  updateConnections: (connections: Connection[]) => void;
  updateTokens: (tokens: Tokens) => void;
}

export const AuthProvider = (props: AuthProviderProps) => {
  const { children, isAuthenticated, clearTokens, updateConnections, updateTokens, setAuthentication } = props;

  const clearAuthState = useCallback(() => {
    console.log("Auth Provider | clearAuthState");
    setAuthentication(false);
    updateConnections([]);
    clearTokens();
    clearCookies();
  }, []);
  
  const getAuthState = useCallback(() => {
    console.log("Auth Provider | getAuthState");
    const authStateStr = cookies.get(COOKIE_KEY_AUTH_STATE);
    if (!authStateStr) {
      return;
    }
    const authState = JSON.parse(authStateStr);
    console.log("Auth Provider | getAuthState - got", authState);
    setAuthentication(authState.isLoggedIn);
    updateConnections(authState.connections);
  }, []);

  const getTokens = useCallback(async () => {
    console.log("Auth Provider | getTokens");
    try {
      const res = await fetch(`${config.api.backend}/auth`, { credentials: "include" });
      if (res.status === 401) {
        clearAuthState();
        return;
      }
      
      const tokens = parseAccessTokens();
      console.log("Auth Provider | getTokens - got", tokens);
      updateTokens(tokens);
    } catch (e) {
      clearAuthState();
    }
  }, [setAuthentication, clearAuthState, updateTokens]);

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