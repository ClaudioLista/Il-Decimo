const { createLogger, format, transports } = require("winston");
const path = require("path");
require("winston-mongodb");

const { vault } = require("./vault");

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const run = async (dbString) => {

const logger = createLogger({
  levels: logLevels,
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    // new transports.MongoDB({
    //   db: dbString,
    //   options: {
    //     useUnifiedTopology: true,
    //   },
    //   collection: "info_logs",
    //   expireAfterSeconds: 15778800, //expire after 6 months
    //   format: format.combine(format.timestamp(), format.json()),
    // }),
    // new transports.MongoDB({
    //   level: "warn",
    //   db: dbString,
    //   options: {
    //     useUnifiedTopology: true,
    //   },
    //   collection: "warn_logs",
    //   expireAfterSeconds: 15778800,
    //   format: format.combine(format.timestamp(), format.json()),
    // }),
    // new transports.MongoDB({
    //   level: "error",
    //   db: dbString,
    //   options: {
    //     useUnifiedTopology: true,
    //   },
    //   collection: "error_logs",
    //   expireAfterSeconds: 15778800,
    //   format: format.combine(format.timestamp(), format.json()),
    // }),
    new transports.File({
      filename: path.join(__dirname, "..", "logs", "info.log"),
      level: "info",
    }),
    new transports.File({
      filename: path.join(__dirname, "..", "logs", "warn.log"),
      level: "warn",
    }),
    new transports.File({
      filename: path.join(__dirname, "..", "logs", "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(__dirname, "..", "logs", "combined.log"),
    }),
  ],
});
return logger
}
exports.logger = run;
