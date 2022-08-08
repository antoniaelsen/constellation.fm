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
    client,
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

  const verifyCallback = async (req, accessToken: string, refreshToken: string, extraParams, profile, done) =>  {
    const { displayName, emails, id, name, picture } = profile;
    logger.info(`Verifying user [${id}]`);

    let existing = await client.user.findFirst({ where: { auth0Id: id } });
    if (!existing) {
      try {
        existing = await client.user.create({
          data: {
            auth0Id: id,
            firstName: name.givenName,
            lastName: name.familyName,
            email: emails[0].value,
          }
        });
        logger.info(`Created user [${id}]`);
      } catch (e: any) {
        logger.warn(`Failed to create user: ${e}`);
        return done(e);
      }
    } else {
      logger.info(`Found existing user [${id}] in database "${existing.firstName} ${existing.lastName}"`);
    }

    const user = {
      id,
      displayName,
      name,
      picture,
      connections: [],
      email: emails[0].value,
    }

    try {
      const connections = await client.connection.findMany({ where: { userId: existing.id } });
      user.connections = connections.reduce((acc, { service, accessToken, refreshToken, expiresAt, }) => ({
        ...acc,
        [service]: {
          accessToken,
          refreshToken,
          expiresAt
        }
      }), {});
    } catch (e: any) {
      logger.warn(e)
    }

    logger.info(`Returning user with connections ${JSON.stringify(user, null, 2)}`)

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

  return { router };
};

export default createAuth0AuthMiddleware;
