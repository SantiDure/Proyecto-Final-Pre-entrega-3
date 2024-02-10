import { Router } from "express";
import {
  deleteUserController,
  getUserController,
  postUserController,
  putUserController,
} from "../../controllers/user.controller.js";

export const usersRouter = Router();

usersRouter.post("/", postUserController);
usersRouter.get("/current", getUserController);
usersRouter.put("/", putUserController);
usersRouter.delete("/", deleteUserController);
