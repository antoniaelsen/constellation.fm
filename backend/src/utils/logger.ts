import winston from 'winston';

const LOG_LEVEL_LIMIT = 12;

winston.addColors({
  info: 'white',
  debug: 'grey',
});

const format = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp(),
  winston.format.printf((meta) => {
    const { level, message, labels, timestamp } = meta;
    const padding = level.length <= 7 ? 7: 17;
    return `${
      timestamp
    } | ${
      level.padEnd(padding, ' ')
    } | ${
      (labels || []).join("-").slice(0, LOG_LEVEL_LIMIT).padEnd(LOG_LEVEL_LIMIT, ' ')
    } | ${message}`;
  })
);
 

export const logger = winston.createLogger({
  format: winston.format.combine(format),
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'output.log' })
  ], 
});