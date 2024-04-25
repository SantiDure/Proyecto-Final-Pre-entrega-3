import { Router } from "express";
import {
  deleteInactiveController,
  getUserController,
  postUserController,
  putUserController,
  changeRolUserAndPremiumController,
  resetPasswordController,
  postDocumentsController,
  getUsersController,
  deleteUserByIdController,
} from "../../controllers/user.controller.js";
import { extractTokenFromCookie } from "../../middlewares/cookies.js";
import { uploader } from "../../utils/multer.js";
import { onlyAdmin } from "../../middlewares/autorizaciones.js";
import { createCart } from "../../middlewares/createCart.js";

export const usersRouter = Router();
usersRouter.get("/", onlyAdmin, getUsersController);
usersRouter.get("/current", getUserController);
usersRouter.post("/", createCart, postUserController);
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
//modificar este endpoint para que elimine todos los usuarios inactivos por 2 dias
usersRouter.delete("/", onlyAdmin, deleteInactiveController);
//
usersRouter.delete("/:uid", onlyAdmin, deleteUserByIdController);
