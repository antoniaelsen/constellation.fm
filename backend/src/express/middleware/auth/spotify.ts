import { Request, Response, Router } from "express";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";

const scopes = [
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
  "user-read-private",
  "streaming",
];

const createSpotifyAuthMiddleware = ({
  config,
  logger: mainLogger,
  path,
  redirectWithToken,
  saveReturnTo
}) => {
  const logger = mainLogger.child({ labels: ['spotify']});
  const { clientID, clientSecret } = config.spotify;
  logger.info(`Client Id  : ${clientID}`);
  logger.info(`Secret     : ${clientSecret}`);
  logger.info(`Redirect   : ${config.callbackDomain}`);
  logger.info(`Callback   : ${`https://${config.callbackDomain}${path}/callback`}`);

  const params = {
    clientID,
    clientSecret,
    passReqToCallback: true,
    callbackURL: `https://${config.callbackDomain}${path}/callback`,
  };

  const connectAndRedirect = (req, res) => {
    const user = req.user;
    const account = req.account;

    logger.info(`Connect and redirect`)
    logger.info(`- req cookies: ${JSON.stringify(req.cookies)}`);
    logger.info(`- user: ${JSON.stringify(user, null, 2)}`)
    logger.info(`- account: ${JSON.stringify(account, null, 2)}`);

    if (!user) {
      logger.info(`Error connecting account -- invalid user`);
    }
  
    user.account = req.account;
    req.logIn(user, (error) => {
      if (!error) {
        logger.info("- successfully updated user");
        return;
      }
      logger.error("- failed to update user");
    });
    
    redirectWithToken(req, res);
    // // TODO(aelsen)
    // if (!account) {
    //   logger.info(`Error connecting account`);
    // }

    // account.userId = user.id;
    // account.save((err) => {
    //   if (err) {
    //     // TODO(aelsen)
    //     logger.info(` Error connecting account: ${JSON.stringify(err, null, 2)}`);
    //   }
  
    //   redirectWithToken(req, res);
    // });
  }

  const verifyCallback = (req, accessToken, refreshToken, expires_in, profile, done) =>  {
    logger.info(`Got user login`);
    logger.info(`- req cookies: ${JSON.stringify(req.cookies)}`);
    logger.info(`- access token: ${accessToken}`);
    logger.info(`- refresh token: ${refreshToken}`);
    logger.info(`- token expires in: ${expires_in}`);
    logger.info(`- profile: ${JSON.stringify(profile, null, 2)}`);

    // TODO(aelsen): verify?
    return done(null, { spotify: { accessToken }});
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

  const router = Router();
  router.get("/", saveReturnTo, authenticate);
  router.get("/callback", authenticate, connectAndRedirect);

  return router;
};

export default createSpotifyAuthMiddleware;
