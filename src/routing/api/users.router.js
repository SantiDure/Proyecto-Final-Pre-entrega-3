import { Router } from "express";
import {
  deleteUserController,
  getUserController,
  postUserController,
  putUserController,
  changeRolUserAndPremiumController,
} from "../../controllers/user.controller.js";

export const usersRouter = Router();

usersRouter.post("/", postUserController);
usersRouter.get("/current", getUserController);
usersRouter.put("/", putUserController);
usersRouter.put("/premium/:uid", changeRolUserAndPremiumController);
usersRouter.delete("/", deleteUserController);
