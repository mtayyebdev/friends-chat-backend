import Message from "../models/message.model.js";
import { TryCatchHandler } from "../middlewares/tryCatchHandler.js";
import { APIError } from "../utils/apiError.js";
import User from "../models/user.model.js";
import { UploadOnCloudinary } from "../utils/uploadFile.js";
import { io, GetOnlineUser } from "../utils/socket.js";

const GetChattingUsersController = TryCatchHandler(async (req, res) => {
  const users = await User.find({}).select("-password");

  return res.status(200).json({
    message: "Chatting Users.",
    success: true,
    data: users,
  });
});

const CreateMessageController = TryCatchHandler(async (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  const file = req.file || "";

  if (!id) {
    throw new APIError(404, "User not found.");
  }

  if (!text && !file.path) {
    throw new APIError(404, "Pleaes enter Message or File");
  }

  let imageURL = "";
  if (file.path) {
    const image = UploadOnCloudinary(file.path);
    imageURL = image.url;
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: id,
    content: text || "",
    attachments: imageURL,
  });

  if (!message) {
    throw new APIError(400, "Something went wrong during sending message.");
  }

  const userId = GetOnlineUser(id);
  if (userId) {
    io.to(userId).emit("newMessage", message)
  }

  res.status(200).json({
    message: "Message Sended.",
    success: true,
    data: message,
  });
});

const GetMessagesController = TryCatchHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new APIError(404, "User not found.");
  }

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: id },
      { receiver: req.user._id, sender: id },
    ],
  });

  return res.status(200).json({
    message: "Messages finded.",
    success: true,
    data: messages,
  });
});

export {
  GetChattingUsersController,
  GetMessagesController,
  CreateMessageController,
};
