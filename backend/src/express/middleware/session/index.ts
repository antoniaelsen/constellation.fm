import { CookieOptions } from "express";
import session from "express-session";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from "passport";

const createSessionMiddleware = ({ client, config, logger: mainLogger }) => {
  const logger = mainLogger.child({ labels: ['session'] });

  const cookieParams:CookieOptions = {
    // domain:,
    httpOnly: true,
    // maxAge:,
    // path:,
    sameSite: "lax",
    secure: true,
  };

  logger.info(`Session    : ${process.env.SESSION_SECRET}`);
  const sessionFunc = session({ 
    cookie: cookieParams,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      client,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  });

  const passportInit = passport.initialize();
  const passportSession = passport.session();

  passport.serializeUser((user, done) => {
    // logger.info(`Serializing user ${printUser(user)}`);
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    // logger.info(`Deserializing user ${printUser(user)}`);
    done(null, user as any);
  });

  return { mw: [sessionFunc, passportInit, passportSession] };
};

export default createSessionMiddleware;
