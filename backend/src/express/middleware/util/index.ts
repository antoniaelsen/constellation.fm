import cors from 'cors';
import type { NextFunction, Response } from "express";
import type { MiddlewareFunc } from 'express/types/MiddlewareFunc';
import type { Request } from 'express/types/Request';

const createUtilMiddleware = ({ config, logger }): { mw: MiddlewareFunc[] } => {
  const childLogger = logger.child({ label: 'express' });
  const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const session = req.sessionID ? `[${req.sessionID}]` : '[no session]';
    const user = req.user ? `[${req.user?.id}]` : '[no user]';
    const prefix = [session, user].join(' ');
    
    const str = `${prefix} [${req.method}] "${req.path}"${req.xhr ? ' XHR' : ''} from origin ${req.get('Origin')} "${req.path}"`;
    childLogger.debug(str);

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