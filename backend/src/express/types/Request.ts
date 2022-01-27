import { Request as ExpressRequest } from "express";

export type ConnectionTokens = {
  accessToken: string;
  refreshToken: string;
};

export type ConnectionTokensMap = {
  [key: string]: ConnectionTokens
};

export type Account = {
  service: string;
  tokens: ConnectionTokens;
};

export interface Request extends ExpressRequest {
  user?: {
    _connections?: ConnectionTokensMap,
    id?: string;
  },
  account?: Account;
  session?: {
    target?: string;
    returnTo?: string;
  },
  sessionID?: any;
}