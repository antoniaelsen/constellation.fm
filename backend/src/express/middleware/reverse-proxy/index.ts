import axios from 'axios';
import { Router } from "express";
import ExpressHttpProxy from 'express-http-proxy';
import { ResponseFilter } from "express-winston";

import { Request } from "express/types/Request";
import { getAccessToken } from '../../util';



const createReverseProxy = (service: string, reauthorize: any, url: string, { config, logger: mainLogger }) => {
  const logger = mainLogger.child({ labels: [`proxy-${service}`] });

  const retry = async (req) => {
    const token = getAccessToken(req, service);

    const retryUrl = `${url}${req.url}`
    logger.info(`[${req.sessionID}] [${(req.user as any)?.id}] Retrying proxied request to ${retryUrl} with token ${token}`);

    try {
      const retry = await axios({
        method: req.method,
        url: retryUrl,
        headers: { 'Authorization': `Bearer ${token}`, },
        data: req.body
      });


      logger.info(`[${req.sessionID}] [${(req.user as any)?.id}] retry response status ${retry.status}`);
      if (retry.status !== 200) {
        return null;
      }

      return retry.data;
    } catch (e) {
      logger.error(`Failed retry ${JSON.stringify(e, null, 2)}`)
    }

    return null;
  }

  const proxyReqOptDecorator = (proxyReqOpts: any, req: Request) => {
    const token = getAccessToken(req, service);
    logger.debug(`[${req.sessionID}] [${(req.user as any)?.id}] Proxying request ${req.path}`);
    if (!token) {
      logger.error(`[${req.sessionID}] [${(req.user as any)?.id}] Failed to apply token to proxied request`);
      return proxyReqOpts;
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
    if (proxyRes.statusCode !== 401) return proxyResData;

    logger.error(`[${userReq.sessionID}] [${(userReq.user as any)?.id}] Not authorized`);
    const reauth = await reauthorize(userReq, userRes);
    if (!reauth) return proxyResData;

    const data = await retry(userReq);
    if (data === null) return proxyResData;

    return data;
  }

  return ExpressHttpProxy(url, {
    timeout: 5000,
    proxyReqOptDecorator,
    userResHeaderDecorator,
    userResDecorator,
  });
};

const createReverseProxyMiddleware = ({ config, logger: mainLogger, path, services }) => {
  const router = Router();
  services.forEach(({ service, reauthorize, url }) => {
    router.use(`/${service}`,
      createReverseProxy(service, reauthorize, url, { config, logger: mainLogger }),
    );
  });

  return { mw: [router] };
};

export default createReverseProxyMiddleware;
