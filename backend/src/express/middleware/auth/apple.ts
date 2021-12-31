import { Request, Response, Router } from "express";
import passport from "passport";
import { Strategy as AppleMusicStrategy } from "passport-apple-music";

const scopes = [
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
  "user-read-private",
  "streaming",
];

const createAppleAuthMiddleware = ({
  config,
  logger: mainLogger,
  path,
  redirectWithToken,
  saveReturnTo
}) => {
  const logger = mainLogger.child({ labels: ['apple']});
  const { keyID, privateKeyLocation, teamID } = config.apple;
  logger.info(`keyId      : ${keyID}`);
  logger.info(`teamId     : ${teamID}`);
  logger.info(`key loc    : ${privateKeyLocation}`);
  logger.info(`Redirect   : ${config.callbackDomain}`);
  logger.info(`Callback   : ${`https://${config.callbackDomain}${path}/callback`}`);

  const params = {
    keyID,
    teamID,
    privateKeyLocation,
    passReqToCallback: true,
    callbackURL: `https://${config.callbackDomain}${path}/callback`,
  };

  const connectAndRedirect = (req, res) => {
    const user = req.user;
    const account = req.account;

    logger.info(`Connect and redirect`)
    logger.info(`- user: ${JSON.stringify(user, null, 2)}`)
    logger.info(`- account: ${JSON.stringify(account, null, 2)}`);

    if (!user) {
      // TODO(aelsen)
      logger.info(`Error connecting account -- invalid user`);
    }
    
    redirectWithToken(req, res);
  }

  const verifyCallback = (req, accessToken, refreshToken, profile, done) =>  {
    logger.info(`Got user login`);
    logger.info(`- access token: ${accessToken}`);
    logger.info(`- refresh token: ${refreshToken}`);
    logger.info(`- profile: ${JSON.stringify(profile, null, 2)}`);

    // TODO(aelsen): verify?
    return done(null, { spotify: { accessToken }});
  };

  passport.use(
    new AppleMusicStrategy(
      params,
      verifyCallback,
    ),
  );

  const authenticate = passport.authorize("apple-music", {
    failureRedirect: "/", // TODO(aelsen): to frontend?
  });

  const router = Router();
  router.get("/", saveReturnTo, authenticate);
  router.get("/callback", authenticate, connectAndRedirect);

  return router;
};

export default createAppleAuthMiddleware;
