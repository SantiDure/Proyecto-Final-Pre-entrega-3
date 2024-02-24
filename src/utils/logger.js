import winston from "winston";
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
};
export const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.File({
      level: "debug",
      filename: "./logs/errors.log",
    }),
  ],
});
