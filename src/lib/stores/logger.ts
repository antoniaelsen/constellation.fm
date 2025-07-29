import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino';
import { get, readable, type Readable } from 'svelte/store';
import { browser, dev } from '$app/environment';

export enum ServerEnvironment {
	DEV,
	PROD
}

export type Logger = PinoLogger & {
	setLogLevel?: (NODE_ENV: ServerEnvironment) => LoggerOptions['level'];
};

const LOG_LEVEL_DEFAULT = 'silent';

const plogger: Logger = (() => {
	const prodTargets = [
		{
			level: 'trace',
			target: 'pino/file',
			options: { destination: './server.log' }
		}
	];

	const devTargets = [
		{
			level: 'trace',
			target: 'pino-pretty',
			options: {
				singleLine: true,
				ignore: 'module,pid,hostname',
				messageFormat: `[{module}] {msg}`
			}
		},
		...prodTargets
	];

	const opts = {
		transport: {
			level: LOG_LEVEL_DEFAULT,
			formatters: {
				level: (label: string) => {
					return { level: label.toUpperCase() };
				}
			},
			targets: dev ? devTargets : prodTargets
		}
	};

	const bopts = {
		browser: { asObject: false },
		transport: dev
			? {
					target: 'pino-pretty',
					options: {
						colorize: true,
						levelFirst: true,
						translateTime: true
					}
				}
			: undefined
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

	plogger.level = logLevel;

	return logLevel;
};

const pLoggerStore: Readable<PinoLogger> = readable<PinoLogger>(plogger);

export const logger = get(pLoggerStore);
