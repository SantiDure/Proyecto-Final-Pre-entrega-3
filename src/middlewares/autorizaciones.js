export function onlySessionActive(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect("/unauthorized");
  }
  next();
}

export function onlyAdmin(req, res, next) {
  if (req.user.rol !== "admin") {
    res.redirect("/unauthorized");
  }
  next();
}

export function onlyUser(req, res, next) {
  if (req.user.rol !== "user") {
    res.redirect("/unauthorized");
  }
  next();
}
