import express from "express";
import {
  CreateMessageController,
  GetChattingUsersController,
  GetMessagesController,
} from "../controllers/message.controller.js";
import { upload } from "../utils/uploadFile.js";
import { VerifyUser } from "../middlewares/verifyUser.middleware.js";

const MessageRouter = express.Router();

MessageRouter.route("/sendmessage/:id").post(
  VerifyUser,
  upload.single("file"),
  CreateMessageController
);
MessageRouter.route("/users").get(VerifyUser, GetChattingUsersController);
MessageRouter.route("/getmessages/:id").get(VerifyUser, GetMessagesController);

export {MessageRouter}
