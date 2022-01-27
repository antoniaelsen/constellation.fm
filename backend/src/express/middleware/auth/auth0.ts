import { Router } from "express";
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
    addConnection,
    connectAndRedirect,
    redirectToReturnTo,
    saveReturnTo
  }) => {
  const logger = mainLogger.child({ labels: ['auth0'] });

  const { clientID, clientSecret, domain } = config.auth.auth0;
  logger.info(`Client Id  : ${clientID}`);
  logger.info(`Secret     : ${clientSecret}`);
  logger.info(`Domain     : ${domain}`);
  logger.info(`Redirect   : ${config.backendDomain}`);
  logger.info(`Callback   : ${`https://${config.backendDomain}${path}/callback`}`);

  const params = {
    clientID,
    clientSecret,
    domain,
    passReqToCallback: true,
    callbackURL: `https://${config.backendDomain}${path}/callback`,
  };

  const verifyCallback = (req, accessToken: string, refreshToken: string, extraParams, profile, done) =>  {
    const { displayName, emails, id, name, user_id } = profile;
    const user = {
      displayName,
      emails,
      id,
      name,
      user_id
    }
    logger.info(`Verifying user [${user.id}]`);

    // TODO(aelsen): verify
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

  const router = Router();
  router.get("/", saveReturnTo, authenticate);
  router.get("/callback", authenticate, redirectToReturnTo);

  return router;
};

export default createAuth0AuthMiddleware;
