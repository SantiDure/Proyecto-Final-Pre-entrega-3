export const ErrorType = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
};

export function newError(type, message) {
  const error = new Error(message);
  error.name = type;
  return error;
}
