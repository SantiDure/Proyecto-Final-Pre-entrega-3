import { Router } from "express";
import {
  deleteUserController,
  getUserController,
  postUserController,
  putUserController,
  changeRolUserAndPremiumController,
  resetPasswordController,
  postDocumentsController,
  getUsersController,
} from "../../controllers/user.controller.js";
import { extractTokenFromCookie } from "../../middlewares/cookies.js";
import { uploader } from "../../utils/multer.js";
import { onlyAdmin } from "../../middlewares/autorizaciones.js";

export const usersRouter = Router();
usersRouter.get("/", onlyAdmin, getUsersController);
usersRouter.get("/current", getUserController);
usersRouter.post("/", postUserController);
usersRouter.post(
  "/:uid/documents/:typeofdocument",
  uploader.single("file"),
  postDocumentsController
);
usersRouter.put("/", putUserController);
usersRouter.put(
  "/resetpassword/:uid",
  extractTokenFromCookie,
  resetPasswordController
);
usersRouter.put("/premium/:uid", changeRolUserAndPremiumController);
usersRouter.delete("/", deleteUserController);
