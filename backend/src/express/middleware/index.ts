import createAuthMiddleware from "./auth";
import createUtilMiddleware from "./util";
import { MiddlewareFunc } from "../../express/types/MiddlewareFunc";

interface Middleware {
  auth: MiddlewareFunc[],
  util: MiddlewareFunc[],
}

const createMiddleware = ({ config, logger }): Middleware => {
  const { mw: auth, jwtVerify } = createAuthMiddleware({
    config: config.auth,
    logger,
    path: "/auth"
  });
  const { mw: util } = createUtilMiddleware({ config, logger });

  return {
    auth,
    util
  };
};

export default createMiddleware;