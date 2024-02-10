export function getTokenFromCookie(cookieName = "auth") {
  return function (req, res, next) {
    req.token = req.signedCookies[cookieName];
    next();
  };
}
