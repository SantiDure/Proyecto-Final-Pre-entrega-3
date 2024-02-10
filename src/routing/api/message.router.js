import {
  getMessagesController,
  getMessageControllerId,
  postMessageController,
  deleteMessageController,
} from "../../controllers/message.controller.js";
import { Router } from "express";
export const messageRouter = Router();
messageRouter.get("/:mid", getMessageControllerId);
messageRouter.get("/", getMessagesController);
messageRouter.post("/", postMessageController);
messageRouter.delete("/:cid", deleteMessageController);
