import createAuthMiddleware from "./auth";
import createUtilMiddleware from "./util";
import createReverseProxyMiddleware from "./reverse-proxy";
import createSessionMiddleware from "./session";
import { MiddlewareFunc } from "../../express/types/MiddlewareFunc";

interface Middleware {
  auth: MiddlewareFunc[],
  util: MiddlewareFunc[],
  reverseProxy: MiddlewareFunc[],
  session: MiddlewareFunc[],
}

const createMiddleware = ({ client, config, logger }): Middleware => {
  const { mw: session } = createSessionMiddleware({ client, config, logger });
  const { mw: util } = createUtilMiddleware({ config, logger });
  const { mw: auth } = createAuthMiddleware({ client, config, logger, path: "/auth" });
  const { mw: reverseProxy } = createReverseProxyMiddleware({ config, logger, path: "/api" });

  return {
    auth,
    util,
    reverseProxy,
    session
  };
};

export default createMiddleware;