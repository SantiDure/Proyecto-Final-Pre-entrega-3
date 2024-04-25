import { Router } from "express";
import passport from "passport";
import {
  appendJwtAsCookie,
  removeJwtFromCookies,
} from "../../middlewares/autenticaciones.js";
import { userDTO } from "../../dto/user.dto.js";
import { logger } from "../../utils/logger.js";
import { userService } from "../../services/index.js";

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
  passport.authenticate("jwt", { failWithError: true }),
  function (req, res) {
    console.log(req.user);
    return res.status(200).json(new userDTO(req.user));
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

sessionRouter.delete("/current", removeJwtFromCookies, async (req, res) => {
  await userService.updateOneService(req.user._id, {
    $set: { last_connection: Date(Date.now) },
  });
  req.session.destroy((err) => {
    res.status(204).json({ message: "logout success" });
  });
});

sessionRouter.post(
  "/resetpassword/:token",
  appendJwtAsCookie,
  passport.authenticate("jwt", { failWithError: true }),
  async (req, res) => {
    try {
      logger.info(req.user);
      return res.status(200).json({ status: "success" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  }
);
