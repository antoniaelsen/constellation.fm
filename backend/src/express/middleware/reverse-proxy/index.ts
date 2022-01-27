import { Router } from "express";
import ExpressHttpProxy from 'express-http-proxy';
import { ResponseFilter } from "express-winston";

import { Request } from "express/types/Request";


const services = [
  { service: "spotify", url: "https://api.spotify.com/v1" }
];

const createReverseProxy = (service: string, url: string, { config, logger: mainLogger }) => {
  const logger = mainLogger.child({ labels: [`proxy-${service}`] });

  const getToken = (req: Request) => {
    const connections = req.user?._connections;
    if (!connections) return null;

    return connections[service]?.accessToken;
  }

  const proxyReqOptDecorator = (proxyReqOpts: any, req: Request) => {
    const token = getToken(req);
    if (!token) {
      logger.error(`[${req.sessionID}] [${(req.user as any)?.id}] Failed to apply token to proxied request`);
    }
    logger.info(`[${req.sessionID}] [${(req.user as any)?.id}] Proxying request ${req.path}`);
    proxyReqOpts.headers['Authorization'] = `Bearer ${token}`;
    return proxyReqOpts;
  };

  const userResHeaderDecorator = (headers, userReq: Request, userRes: ResponseFilter, proxyReq: Request, proxyRes: ResponseFilter) => {
    return {
      ...headers,
      "Access-Control-Allow-Origin": `https://${config.frontendDomain}`
    };
  };

  return ExpressHttpProxy(url, { proxyReqOptDecorator, userResHeaderDecorator });
};


const createReverseProxyMiddleware = ({ config, logger: mainLogger, path }) => {
  const router = Router();
  services.forEach(({ service, url }) => {
    router.use(`/${service}`, createReverseProxy(service, url, { config, logger: mainLogger }));
  });

  return { mw: [router] };
};

export default createReverseProxyMiddleware;
