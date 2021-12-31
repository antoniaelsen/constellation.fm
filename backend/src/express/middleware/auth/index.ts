import { CookieOptions, NextFunction, request, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import session from "express-session";
import passport from "passport";

import createAppleAuthMiddleware from "./apple";
import createAuth0AuthMiddleware from "./auth0";
import createSpotifyAuthMiddleware from "./spotify";

const COOKIE_KEY = "token";

type ReturnToRequest = Request & {
  session: {
    returnTo: string
  }
}

const createAuthMiddleware = ({ config, logger: mainLogger, path }) => {
  const logger = mainLogger.child({ labels: ['auth'] });

  const cookieParams:CookieOptions = {
    // domain:,
    httpOnly: true,
    // maxAge:,
    // path:,
    sameSite: "lax",
    // secure: true,
  };

  const setConnectionTokens = (req, res) => {
    const account = req.user.account;
    logger.info(`Set connection tokens - account: ${JSON.stringify(account)}`)
    if (!account) return;

    const connections = account ? [Object.keys(account)].join(",") : [];
    logger.info(`- connections: ${connections}`);
    Object.entries(account).forEach(([key, value]) => {
      const token = (value as any)?.accessToken;
      if (!token) return;
      logger.info(`- setting cookie key ${key} to ${token}`)
      res.cookie(key, token, { ...cookieParams, httpOnly: false });
    });
  }

  const saveReturnTo = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Saving returnTo: ${req.query?.returnTo}`)
    if (req.query && req.query.returnTo) {
      (req as any).session.returnTo = req.query.returnTo;
    }
    return next();
  };
 
  const redirectWithToken = (req, res) => {
    const defaultUrl = `https://${config.redirectDomain}/`;
    const returnTo = (req as any).session.returnTo || defaultUrl;

    // TODO(aelsen): implement token
    //  consolidate all available tokens?
    //  add tokens as cookies
    logger.info(`Redirect with token...`);
    logger.info(`- returnTo: ${returnTo}`);
    logger.info(`- user: ${JSON.stringify(req.user, null, 2)}`);
    logger.info(`- account: ${JSON.stringify(req.user.account, null, 2)}`);

    if (req.user) {
      const token = jwt.sign(req.user, config.authTokenSecret);
      res.cookie(COOKIE_KEY, token, { ...cookieParams, httpOnly: false });
      logger.info(`- token: ${token}`);
      setConnectionTokens(req, res);
    }
    
    return res.redirect(returnTo);
  };

  const auth0Auth = createAuth0AuthMiddleware({
    config,
    logger,
    redirectWithToken,
    saveReturnTo,
    path: `${path}/auth0`
  });
  const appleAuth = createAppleAuthMiddleware({
    config,
    logger,
    redirectWithToken,
    saveReturnTo,
    path: `${path}/apple`
  });
  const spotifyAuth = createSpotifyAuthMiddleware({
    config,
    logger,
    redirectWithToken,
    saveReturnTo,
    path: `${path}/spotify`
  });

  const jwtVerify = {};

  const router = Router();

  logger.info(`Session    : ${process.env.SESSION_SECRET}`);
  const sessionFunc = session({ 
    cookie: cookieParams,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  });
  router.use(sessionFunc as any);

  router.use(passport.initialize());
  router.use(passport.session());

  passport.serializeUser((user, done) => {
    logger.info(`Serializing user: ${JSON.stringify(user)}`);
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    logger.info(`Deserializing user: ${JSON.stringify(user)}`);
    done(null, user as any);
  });

  router.use("/auth0", auth0Auth);
  router.use("/spotify", spotifyAuth);
  router.get('/tokens', (req, res) => {
    logger.info("Got request for tokens");
    logger.info(` - user: ${JSON.stringify(req.user)}`)
    if (!req.user) {
      res.status(401);
      res.send();
      return;
    }
    setConnectionTokens(req, res);
    res.send();
  })
  
  return { mw: [router], jwtVerify };
};

export default createAuthMiddleware;
