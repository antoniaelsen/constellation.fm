import axios from "axios";
import { NextFunction, Response, Router } from "express";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

import { Request } from "express/types/Request";
import { getRefreshToken } from "../../util";
import qs from "qs";


const SERVICE_NAME = "spotify";

const scopesSpotify = [
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
  "playlist-read-private",
  "streaming",
  "user-library-modify",
  "user-library-read",
  "user-tmodify-playback-state",
  "user-read-currently-playing",
  "user-read-email",
  "user-read-playback-position",
  "user-read-playback-state",
  "user-read-private",
  "user-read-recently-played",
  "user-top-read",
  "ugc-image-upload"
];

const scopesSpotifyPlayback = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state"
];

const scopes = {
  [SERVICE_NAME]: scopesSpotify,
  [`${SERVICE_NAME}playback`]: scopesSpotifyPlayback
}

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
  const logger = mainLogger.child({ labels: [SERVICE_NAME]});
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

  const updateUser = async ({target, id, accessToken, refreshToken, expiresAt, done}) => {
    const existingUser = await client.user.findFirst({ where: { auth0Id: id } });
    if (!existingUser) {
      const msg = `Failed to create connection: no user [${id}]`;
      logger.warn(msg);
      return done(msg);
    }

    const account = {
      service: target,
      data: {
        accessToken,
        refreshToken,
        expiresAt,
      }
    };
  

    // TODO(aelsen): make generic
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
      logger.info(`Found existing connection entry for user [${existingUser.id}] service [${target}], updating...`);
      await client.connection.update({
        data: {
          accessToken,
          refreshToken,
          expiresAt
        },
        where: { userId_service: { userId: existingUser.id, service: target } }
      })
    }

    return done(null, account);
  }

  const reauthorize = async (req: Request, res: Response) => {
    logger.info(`Reauthorizing...`);

    Promise.all([SERVICE_NAME, `${SERVICE_NAME}playback`].map(async (target) => {
      const refreshToken = getRefreshToken(req, target);
      if (!refreshToken) {
        logger.info(`Failed to get request token, not reauthorizing`);
        return null;
      }
  
      const options = {
        headers: {
          'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
  
      const data = qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      });
  
      const tokenRes = await axios.post('https://accounts.spotify.com/api/token', data, options);
      logger.info(`reauthenticate - got res ${tokenRes.status} ${JSON.stringify(tokenRes.data, null, 2)}`);
      if (tokenRes.status === 200) {
        const id = req.user?.id;
        if (!id) {
          logger.warn("No id..")
        }
        const {access_token: accessToken, refresh_token, expires_in} = tokenRes.data;
        // store access token
        const expiresAt = new Date(Date.now() + expires_in).toISOString();
        updateUser({
          target,
          id,
          accessToken,
          refreshToken,
          expiresAt,
          done: (err, account) => {
            req.account = account;
            addConnection(req, res);
          }
        });
      }
    }));

    logger.info(`Return to original req? ${req.path} ${req.params}`)
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
    
    return updateUser({
      target,
      id,
      accessToken,
      refreshToken,
      expiresAt,
      done
    });
  };

  passport.use(
    new SpotifyStrategy(
      params,
      verifyCallback,
    ),
  );

  const authenticate = passport.authorize("spotify", {
    failureRedirect: "/", // TODO(aelsen): to frontend?
    scope: scopes[SERVICE_NAME],
    session: false, // TODO(aelsen): what?
  });

  const authenticatePlayback = passport.authorize("spotify", {
    failureRedirect: "/", // TODO(aelsen): to frontend?
    scope: scopes[`${SERVICE_NAME}playback`],
    session: false, // TODO(aelsen): what?
  });

  const router = Router();
  router.get(
    "/",
    saveReturnTo,
    setScopeTarget(SERVICE_NAME),
    authenticate
  );

  router.get(
    "/playback",
    setScopeTarget(`${SERVICE_NAME}playback`),
    authenticatePlayback
  );

  router.get(
    "/callback", 
    authenticate, 
    connect
  );

  router.get(
    "/reauthorize", 
    reauthorize, 
  );

  return router;
};

export default createSpotifyAuthMiddleware;
