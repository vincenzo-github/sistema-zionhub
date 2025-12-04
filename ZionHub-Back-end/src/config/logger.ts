import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  // Console output
  new winston.transports.Console(),
];

// Adicionar file logging em produção
if (process.env.NODE_ENV === 'production') {
  transports.push(
  // @ts-ignore
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  );
  // @ts-ignore
  transports.push(
    // @ts-ignore
    new winston.transports.File({
      filename: 'logs/all.log',
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
});
