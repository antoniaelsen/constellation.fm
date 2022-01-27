import { NextFunction, Response, Router } from "express";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

import { Request } from "express/types/Request";

const scopes = [
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
  "user-read-private",
  "streaming",
];

const scopesPlayback = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state"
];

const createSpotifyAuthMiddleware = ({
  config,
  logger: mainLogger,
  path,
  addConnection,
  connectAndRedirect,
  redirectToReturnTo,
  saveReturnTo
}) => {
  const logger = mainLogger.child({ labels: ['spotify']});
  const { clientID, clientSecret } = config.auth.spotify;
  logger.info(`Client Id  : ${clientID}`);
  logger.info(`Secret     : ${clientSecret}`);
  logger.info(`Redirect   : ${config.backendDomain}`);
  logger.info(`Callback   : ${`https://${config.backendDomain}${path}/callback`}`);

  const params = {
    clientID,
    clientSecret,
    passReqToCallback: true,
    callbackURL: `https://${config.backendDomain}${path}/callback`,
  };

  const connectAndRequestToken = (req: Request, res: Response) => {
    addConnection(req, res);
    res.redirect(`${path}/playback`);
  };

  const connect = (req: Request, res: Response) => {
    if (req.session?.target === "spotify") {
      connectAndRequestToken(req, res);
      return;
    }

    connectAndRedirect(req, res);
  };

  const setScopeTarget = (target: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.session) {
      req.session = {};
    }
    req.session.target = target;
    return next();
  };

  const verifyCallback = (req, accessToken, refreshToken, expires_in, profile, done) =>  {
    const target = req.session.target;
    logger.info(`Got user [${req.user?.id}] ${profile.id} tokens for scope "${target}" `);

    // TODO(aelsen): verify?
    const account = {
      service: target,
      tokens: {
        accessToken,
        refreshToken
      }
    };
    return done(null, account);
  };

  passport.use(
    new SpotifyStrategy(
      params,
      verifyCallback,
    ),
  );

  const authenticate = passport.authorize("spotify", {
    failureRedirect: "/", // TODO(aelsen): to frontend?
    scope: scopes,
    session: false, // TODO(aelsen): what?
  });

  const authenticatePlayback = passport.authorize("spotify", {
    failureRedirect: "/", // TODO(aelsen): to frontend?
    scope: scopesPlayback,
    session: false, // TODO(aelsen): what?
  });

  const router = Router();
  router.get(
    "/",
    saveReturnTo,
    setScopeTarget("spotify"),
    authenticate
  );

  router.get(
    "/playback",
    setScopeTarget("spotify-playback"),
    authenticatePlayback
  );

  router.get(
    "/callback", 
    authenticate, 
    connect
  );

  return router;
};

export default createSpotifyAuthMiddleware;
