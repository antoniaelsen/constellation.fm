import axios from 'axios';
import { Router } from "express";
import ExpressHttpProxy from 'express-http-proxy';
import { ResponseFilter } from "express-winston";

import { Request } from "express/types/Request";
import { getAccessToken } from '../../util';


const services = [
  { service: "spotify", url: "https://api.spotify.com/v1" }
];

const createReverseProxy = (service: string, url: string, { config, logger: mainLogger }) => {
  const logger = mainLogger.child({ labels: [`proxy-${service}`] });

  const proxyReqOptDecorator = (proxyReqOpts: any, req: Request) => {
    const token = getAccessToken(req, service);
    logger.debug(`[${req.sessionID}] [${(req.user as any)?.id}] Proxying request ${req.path}`);
    if (!token) {
      logger.error(`[${req.sessionID}] [${(req.user as any)?.id}] Failed to apply token to proxied request`);
    }
    proxyReqOpts.headers['Authorization'] = `Bearer ${token}`;
    return proxyReqOpts;
  };

  const userResHeaderDecorator = (headers, userReq: Request, userRes: ResponseFilter, proxyReq: Request, proxyRes: ResponseFilter) => {
    return {
      ...headers,
      "Access-Control-Allow-Origin": `https://${config.frontendDomain}`
    };
  };

  const userResDecorator = async (proxyRes, proxyResData, userReq, userRes) => {
    if (proxyRes.statusCode !== 401) {
      return proxyResData;
    }
    const token = getAccessToken(userReq, service);
    
    logger.debug(`[${userReq.sessionID}] [${(userReq.user as any)?.id}] got ${proxyRes.statusCode} with ${token} redirecting to reauthorize....`);
    userRes.redirect('/auth/spotify/reauthorize');
    return proxyResData;
  }

  return ExpressHttpProxy(url, {
    timeout: 5000,
    proxyReqOptDecorator,
    userResHeaderDecorator,
    userResDecorator,
  });
};

const createReauthenticator = (service: string, { check, reauth }, { config, logger: mainLogger }) => {
  const logger = mainLogger.child({ labels: [`proxy-${service}`] });

  const getRefreshToken = (req: Request) => {
    const connections = req.user?.connections;
    if (!connections) return null;

    return connections[service]?.refreshToken;
  }

  const refreshTokens = (req, res, next) => {
    const unauthorized = res.status();
    logger.info(`Needs refresh? ${unauthorized} - res: ${res.status()}`);
    next()
  }

  return refreshTokens;
};


const createReverseProxyMiddleware = ({ config, logger: mainLogger, path }) => {
  const router = Router();
  services.forEach(({ service, url }) => {
    router.use(`/${service}`,
      createReverseProxy(service, url, { config, logger: mainLogger }),
      createReauthenticator(service, { check: null, reauth: null }, { config, logger: mainLogger })
    );
  });

  return { mw: [router] };
};

export default createReverseProxyMiddleware;
