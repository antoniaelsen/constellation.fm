import { Request, Response, Router } from "express";
import passport from "passport";
import { Strategy as Auth0Strategy } from "passport-auth0";

const scopes = [ // TODO(aelsen): confirm scopes are needed
  "openid",
  "email",
  "profile",
];

const createAuth0AuthMiddleware = ({
    config,
    logger: mainLogger,
    path,
    redirectWithToken,
    saveReturnTo
  }) => {
  const logger = mainLogger.child({ labels: ['auth0'] });

  const { clientID, clientSecret, domain } = config.auth0;
  logger.info(`Client Id  : ${clientID}`);
  logger.info(`Secret     : ${clientSecret}`);
  logger.info(`Domain     : ${domain}`);
  logger.info(`Redirect   : ${config.callbackDomain}`);
  logger.info(`Callback   : ${`https://${config.callbackDomain}${path}/callback`}`);

  const params = {
    clientID,
    clientSecret,
    domain,
    passReqToCallback: true,
    callbackURL: `https://${config.callbackDomain}${path}/callback`,
  };

  const verifyCallback = (req, accessToken: string, refreshToken: string, expires_in, profile, done) =>  {
    logger.info(`Got user login`);
    logger.info(`- req cookies: ${JSON.stringify(req.cookies)}`);
    logger.info(`- access token: ${accessToken}`);
    logger.info(`- refresh token: ${refreshToken}`);
    logger.info(`- token expires in: ${expires_in}`);
    logger.info(`- profile: ${JSON.stringify(profile)}`);
    const { displayName, emails, id, name, user_id } = profile;
    const user = {
      displayName,
      emails,
      id,
      name,
      user_id
    }

    // TODO(aelsen): verify?
    return done(null, user);
  };

  passport.use(
    new Auth0Strategy(
      params,
      verifyCallback,
    ),
  );

  const authenticate = passport.authenticate("auth0", {
    failureRedirect: "/fail", // TODO(aelsen): to frontend?
    scope: scopes.join(" "),
  });

  // const debugAuthenticate = (req, res, next) => {
  //   console.log("Debug auth:", req.url);
  //   passport.authenticate('auth0', (err, user, info) => {
  //       console.log("Debug auth - authenticate");
  //       console.log("- error:", err);
  //       console.log("- user:", user);
  //       console.log("- info:", info);
  //   })(req, res, next);
  // };


  const router = Router();
  router.get("/", saveReturnTo, authenticate);
  router.get("/callback", authenticate, redirectWithToken);

  return router;
};

export default createAuth0AuthMiddleware;
