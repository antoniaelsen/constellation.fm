import { CookieOptions, NextFunction, Response, Router } from "express";

import createAppleAuthMiddleware from "./apple";
import createAuth0AuthMiddleware from "./auth0";
import createSpotifyAuthMiddleware from "./spotify";
import { Request } from "express/types/Request";

const COOKIE_KEY_FRONTEND_ATS = ["spotifyplayback"];

const createAuthMiddleware = ({ client, config, logger: mainLogger, path }) => {
  const logger = mainLogger.child({ labels: ['auth'] });

  const cookieParams: CookieOptions = {
    // domain:,
    httpOnly: true,
    // maxAge:,
    // path:,
    sameSite: "lax",
    // secure: true,
  };

  const addConnection = (req: Request, res: Response) => {
    const user = req.user;
    const account = req.account;
    
    if (!user) {
      logger.error(`[${req.sessionID}] Error connecting account -- no user in session`);
      return;
    }
    
    if (!account) {
      logger.error(`[${req.sessionID}] Error connecting account -- no account in session`);
      return;
    }

    logger.info(`Adding connection to user [${user.id}] for service [${account.service}] ${JSON.stringify(account, null, 2)}`)

    user.connections = {
      ...user.connections,
      [account.service]: account.data,
    }
  
    req.logIn(user, (error) => {
      if (!error) {
        logger.info(`[${req.sessionID}] [${user.id}] Successfully updated user to add connection [${account.service}]`);
        return;
      }
      logger.error(`[${req.sessionID}] [${user.id}] Failed add connection [${account.service}] to user [${user.id}]`);
    });
  };

  const connectAndRedirect = (req: Request, res: Response) => {
    logger.info(`[${req.sessionID}] [${req.user?.id}] Connect and redirect`);
    addConnection(req, res);
    redirectToReturnTo(req, res);
  };

  const setAccessTokenCookies = (req: Request, res: Response) => {
    // Most access tokens will NOT be passed to the FE for security reasons.
    // Only access tokens with insignificant scopes will be passed
    //  e.g. spotify playback scopes for web player.
    const connections = req.user?.connections;

    if (!connections) return;
    
    COOKIE_KEY_FRONTEND_ATS.forEach((service) => {
      const token = connections[service]?.accessToken;
      if (!token) return;
      logger.info(`[${req.sessionID}] [${req.user?.id}] Set connection access token cookie for [${service}]`);
      res.cookie(`cfm-auth-token-${service}`, token, { ...cookieParams, httpOnly: false });
    });
  };

  const setAuthStateCookie = (req: Request, res: Response) => {
    logger.info(`[${req.sessionID}] [${req.user?.id}] Set auth state cookie ${JSON.stringify(req.user, null, 2)}`);
    const authState = {
      connections: Object.keys(req.user?.connections || {}),
      isLoggedIn: !!req.user,
    };
    
    res.cookie("cfm-auth", JSON.stringify(authState), { ...cookieParams, httpOnly: false });

    if (!req?.user?.connections) return;
    Object.entries(req.user.connections).forEach(([service, data]) => {
      logger.info(`[${req.sessionID}] [${req.user?.id}] - ${service} ${data.accessToken}`);
    });
  };

  const saveReturnTo = (req: Request, res: Response, next: NextFunction) => {
    if (req.query && req.query.returnTo) {
      (req as any).session.returnTo = req.query.returnTo;
    }
    return next();
  };
 
  const redirectToReturnTo = (req: Request, res: Response) => {
    const defaultUrl = `https://${config.frontendDomain}/`;
    const returnTo = (req as any).session.returnTo || defaultUrl;
    setAuthStateCookie(req, res);

    return res.redirect(returnTo);
  };

  const auth0Auth = createAuth0AuthMiddleware({
    client,
    config,
    logger,
    addConnection,
    connectAndRedirect,
    redirectToReturnTo,
    saveReturnTo,
    path: `${path}/auth0`
  });
  // const appleAuth = createAppleAuthMiddleware({
  //   config,
  //   logger,
  //   addConnection,
  //   connectAndRedirect,
  //   redirectToReturnTo,
  //   saveReturnTo,
  //   path: `${path}/apple`
  // });
  const spotifyAuth = createSpotifyAuthMiddleware({
    client,
    config,
    logger,
    addConnection,
    connectAndRedirect,
    redirectToReturnTo,
    saveReturnTo,
    path: `${path}/spotify`
  });

  const router = Router();

  router.use("/auth0", auth0Auth);
  router.use("/spotify", spotifyAuth);
  router.get('/', (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401);
      res.send();
      return;
    }
    setAuthStateCookie(req, res);
    setAccessTokenCookies(req, res);
    res.send();
  });
  
  return { mw: [router] };
};

export default createAuthMiddleware;
