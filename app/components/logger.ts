import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'debug';

const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            // Handle object logging
            const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : '';
            return `[${timestamp}] ${level}: ${message}${metaString}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

export default logger;
