import { Request as ExpressRequest } from "express";

export type ConnectionData = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export type ConnectionsMap = {
  [key: string]: ConnectionData
};

export type Account = {
  service: string;
  data: ConnectionData;
};

export interface Request extends ExpressRequest {
  user?: {
    connections?: ConnectionsMap,
    id?: string;
  },
  account?: Account;
  session?: {
    target?: string;
    returnTo?: string;
  },
  sessionID?: any;
}