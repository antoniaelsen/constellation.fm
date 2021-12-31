import cors from 'cors';
import expressWinston from 'express-winston';
import winston from 'winston';
import type { NextFunction, Request, Response } from "express";
import type { MiddlewareFunc } from '../../../express/types/MiddlewareFunc';

const createUtilMiddleware = ({ config, logger }): { mw: MiddlewareFunc[] } => {
  const childLogger = logger.child({ label: 'express' });
  const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    childLogger.info(`[${req.method}] "${req.path}"${req.xhr ? ' XHR' : ''}`,
      `from "${req.headers.referer}" (${req.get('Origin')})`)
    next();
  };

  const corsOptions = {
    credentials: true,
    origin: 'https://constellation.fm:3000',
  };

  return {
    mw: [
      logMiddleware, 
      cors(corsOptions),
      // TODO: rate limit?
    ]
  };
};

export default createUtilMiddleware;