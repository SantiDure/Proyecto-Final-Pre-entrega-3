import logger from "winston";

export function httpLogger(req, res, next) {
  logger.http(`[${req.method}] ${req.url}`);
  next();
}
