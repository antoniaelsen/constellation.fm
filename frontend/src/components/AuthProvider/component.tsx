import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import cookies from "js-cookie";

import { Connection } from "rest/constants";
   
const backendApiUrl = process.env.REACT_APP_BACKEND_URL;

type Tokens = {
  [key: string]: string | null;
};
const parseTokens = () => {
  console.log("AuthProvider | parsing connection tokens");
  const keys: Tokens = {};
  Object.values(Connection).forEach((connection) => {
    const str = cookies.get(connection);
    if (!str) return;
    keys[connection] = str;
    cookies.remove(connection);
  });
  return keys;
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
  updateTokens: (tokens: Tokens) => void;
}


export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const { isAuthenticated, clearTokens, updateTokens, setAuthentication } = props;

  const getSession = useCallback(async () => {
    console.log("AuthProvider | getSession");
    try {
      const res = await fetch(`${backendApiUrl}/auth/tokens`, { credentials: "include" });
      if (res.status === 401) {
        console.log("AuthProvider | getSession - Unauthorized");
        setAuthentication(false);
        clearTokens()
        return;
      }
  
      const tokens = parseTokens();
      console.log("AuthProvider | getSessions - Authorized, tokens:", tokens);
      setAuthentication(true);
      updateTokens(tokens);
    } catch (e) {
      // TODO(aelsen);
      console.log("ERROR", e);
    }
  }, [setAuthentication, updateTokens]);

  const login = useCallback(() => {
    const redirectUri = `${backendApiUrl}/auth/auth0?returnTo=${
      window.location.href
    }`;
    window.location.href = redirectUri;
  }, []);

  const logout = useCallback(() => {
    const redirectUri = `${backendApiUrl}/auth/logout?returnTo=${
      window.location.href
    }`;
    window.location.href = redirectUri;
  }, []);

  useEffect(() => {
    getSession();
  }, [getSession]);


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