import { NextFunction, Response, Router } from "express";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

import { Request } from "express/types/Request";

const scopes = [
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
  "playlist-read-private",
  "streaming",
  "user-library-modify",
  "user-library-read",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-email",
  "user-read-playback-position",
  "user-read-playback-state",
  "user-read-private",
  "user-read-recently-played",
  "user-top-read",
  "ugc-image-upload"
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
  client,
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

  const verifyCallback = async (req, accessToken, refreshToken, expires_in, profile, done) =>  {
    const target = req.session.target;
    logger.info(`Verifying user scope [${target}][${req.user?.id}] "${profile.id}" - ${accessToken}`);

    const id = req.user.id;
    const expiresAt = new Date(Date.now() + expires_in).toISOString();
    const account = {
      service: target,
      data: {
        accessToken,
        refreshToken,
        expiresAt,
      }
    };
  
    const existingUser = await client.user.findFirst({ where: { auth0Id: id } });
    if (!existingUser) {
      const msg = `Failed to create connection: no user [${id}]`;
      logger.warn(msg);
      return done(msg);
    }

    const existingToken = await client.connection.findFirst({ where: { userId: existingUser.id, service: target } });
    if (!existingToken) {
      try {
        await client.connection.create({
          data: {
            accessToken,
            refreshToken,
            expiresAt,
            service: target,
            userId: existingUser.id,
          }
        });
        logger.info(`Created connection entry for user [${id}] service [${target}]`);
      } catch (e: any) {
        logger.warn(`Failed to create connection: ${e}`);
        return done(e);
      }
    } else {
      logger.info(`Found existing connection entry for user [${id}] service [${target}], updating...`);
      await client.connection.update({
        data: {
          accessToken,
          refreshToken,
          expiresAt
        },
        where: { id: existingToken.id }
      })
    }

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
    setScopeTarget("spotifyplayback"),
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
