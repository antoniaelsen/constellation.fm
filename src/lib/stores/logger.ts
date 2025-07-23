import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino';
import { get, readable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';

export enum ServerEnvironment {
	DEV,
	PROD
}

export type Logger = PinoLogger & {
	setLogLevel?: (NODE_ENV: ServerEnvironment) => LoggerOptions['level'];
};

const LOG_LEVEL_DEFAULT = 'silent';

const plogger: Logger = (() => {
	const opts = {
		transport: {
			level: LOG_LEVEL_DEFAULT,
			formatters: {
				level: (label: string) => {
					return { level: label.toUpperCase() };
				}
			},
			targets: [
				{
					level: 'trace',
					target: 'pino-pretty',
					options: {
						singleLine: true,
						ignore: 'module,pid,hostname',
						messageFormat: `[{module}] {msg}`
					}
				},
				{
					level: 'trace',
					target: 'pino/file',
					options: { destination: './server.log' }
				}
			]
		}
	};
	const bopts = {
		browser: { asObject: false },

		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				levelFirst: true,
				translateTime: true
			}
		}
	};

	return pino(browser ? { ...bopts, ...opts } : opts);
})();

plogger.setLogLevel = (NODE_ENV: ServerEnvironment) => {
	let logLevel: LoggerOptions['level'] = LOG_LEVEL_DEFAULT;

	switch (NODE_ENV) {
		case ServerEnvironment.DEV:
			logLevel = 'trace';
			break;
		case ServerEnvironment.PROD:
		default:
			if (browser) {
				logLevel = 'silent';
			} else {
				logLevel = 'info';
			}
			break;
	}

	logger.info(`Logger log level will be set to "${logLevel}".`);
	plogger.level = logLevel;

	return logLevel;
};

const pLoggerStore: Readable<PinoLogger> = readable<PinoLogger>(plogger);

export const logger = get(pLoggerStore);
