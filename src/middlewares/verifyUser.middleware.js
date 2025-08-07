import User from "../models/user.model.js";
import { TryCatchHandler } from "./tryCatchHandler.js";
import { APIError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const VerifyUser = TryCatchHandler(async (req, res, next) => {
  const token = req.cookies.token || "";

  if (!token) {
    throw new APIError(404, "Token not found.");
  }

  const validToken = await jwt.verify(token, process.env.JWT_SECRET);

  if (!validToken) {
    throw new APIError(400, "Invalid User.");
  }

  const user = await User.findById(validToken.id);

  if (!user) {
    throw new APIError(400, "Invalid User.");
  }

  req.user = user;
  req.userId = user._id;
  next();
});

const VerifyAdmin = TryCatchHandler(async (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new APIError(400, "Invalid User.");
  }
  next();
});

export { VerifyUser, VerifyAdmin };
