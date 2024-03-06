import { Router } from "express";
import passport from "passport";
import { appendJwtAsCookie } from "../../middlewares/autenticaciones.js";
import { userDTO } from "../../dto/user.dto.js";
import { logger } from "../../utils/logger.js";
export const sessionRouter = Router();

sessionRouter.post(
  "/",
  passport.authenticate("loginLocal", {
    failWithError: true,
  }),
  appendJwtAsCookie,

  async (req, res) => {
    logger.info(req.user),
      res.status(201).json({ status: "success", user: req.user });
  },
  (error, req, res, next) => {
    res.status(401).json({ status: "error", message: error.message });
  }
);

sessionRouter.get(
  "/current",
  // passport.authenticate("jwt", { failWithError: true }),
  function (req, res) {
    console.log(req.user);
    return res.json(new userDTO(req.user));
  }
);

sessionRouter.get("/githublogin", passport.authenticate("loginGithub"));

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("loginGithub", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

sessionRouter.get("/githublogin", passport.authenticate("loginGithub"));

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("loginGithub", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

sessionRouter.delete("/current", async (req, res) => {
  req.session.destroy((err) => {
    res.status(204).json({ message: "logout success" });
  });
});
