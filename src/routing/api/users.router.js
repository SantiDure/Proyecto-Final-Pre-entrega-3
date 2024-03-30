import { Router } from "express";
import {
  deleteUserController,
  getUserController,
  postUserController,
  putUserController,
  changeRolUserAndPremiumController,
  resetPasswordController,
  postDocumentsController,
} from "../../controllers/user.controller.js";
import passport from "passport";
import { appendJwtAsCookie } from "../../middlewares/autenticaciones.js";
import { extractTokenFromCookie } from "../../middlewares/cookies.js";
import { uploader } from "../../utils/multer.js";

export const usersRouter = Router();

usersRouter.post(
  "/",
  passport.authenticate("jwt", { failWithError: true }),
  appendJwtAsCookie,
  postUserController
);
usersRouter.post(
  "/:uid/documents/:typeofdocument",
  uploader.single("file"),
  postDocumentsController
);
usersRouter.get("/current", getUserController);
usersRouter.put("/", putUserController);
usersRouter.put(
  "/resetpassword/:uid",
  extractTokenFromCookie,
  resetPasswordController
);
usersRouter.put("/premium/:uid", changeRolUserAndPremiumController);
usersRouter.delete("/", deleteUserController);
