import { Router } from "express";
import {
  deleteUserController,
  getUserController,
  postUserController,
  putUserController,
  changeRolUserAndPremiumController,
  resetPasswordController,
} from "../../controllers/user.controller.js";
import passport from "passport";
import { appendJwtAsCookie } from "../../middlewares/autenticaciones.js";
import { extractTokenFromCookie } from "../../middlewares/cookies.js";

export const usersRouter = Router();

usersRouter.post(
  "/",
  passport.authenticate("jwt", { failWithError: true }),
  appendJwtAsCookie,
  postUserController
);
usersRouter.get("/current", getUserController);
usersRouter.put("/", putUserController);
usersRouter.put(
  "/resetpassword/:uid",
  extractTokenFromCookie,
  resetPasswordController
),
  usersRouter.put("/premium/:uid", changeRolUserAndPremiumController);
usersRouter.delete("/", deleteUserController);
