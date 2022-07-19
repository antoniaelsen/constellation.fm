import express from 'express';
import fs from 'fs';
import https from 'https';
import { PrismaClient } from "@prisma/client";

import createMiddleware from './express/middleware';
import config from "./config"
import { logger, logger as mainLogger } from "./utils/logger"; 

const createServer = () => {
  const logger = mainLogger.child({ labels: ['express'] });

  const privateKey  = fs.readFileSync('ssl/constellation.fm-key.pem', 'utf8');
  const certificate = fs.readFileSync('ssl/constellation.fm.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const client = new PrismaClient();

  const app = express();

  const middleware = createMiddleware({ client, config: config.express, logger });

  middleware.session.forEach((mw) => app.use(mw));
  middleware.util.forEach((mw) => app.use(mw));
  
  app.use('/auth', middleware.auth);
  app.use('/api', middleware.reverseProxy);

  const httpsServer = https.createServer(credentials, app);
  return httpsServer;
}

logger.info(`Launching constellation.fm backend (${process.env.NODE_ENV || "development"})`)

const app = createServer();
const port = process.env.PORT || 8888;

logger.info(`Service launched, listening on port ${port}`);
app.listen(port);
