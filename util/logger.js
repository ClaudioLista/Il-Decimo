const { createLogger, format, transports } = require("winston");

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp(), 
    format.simple()),
  transports: [new transports.Console()],
});

exports.logger = logger

