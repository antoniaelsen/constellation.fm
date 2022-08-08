import { Request } from "express/types/Request";

export const getAccessToken = (req: Request, service: string) => {
  const connections = req.user?.connections;
  if (!connections) return null;

  return connections[service]?.accessToken;
}

export const getRefreshToken = (req: Request, service: string) => {
  const connections = req.user?.connections;
  if (!connections) return null;

  return connections[service]?.refreshToken;
}
