// Auth Controller logic here...
import { TryCatchHandler } from "../middlewares/tryCatchHandler.js";
import { APIError } from "../utils/apiError.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { UploadOnCloudinary } from "../utils/uploadFile.js";

const HomeController = TryCatchHandler(async (req, res) => {
  return res.status(200).json({ message: "Welcome to MyApp" });
});

const SignupController = TryCatchHandler(async (req, res) => {
  const { name, phone, password } = req.body;
  const file = req.file || "";
  if (!file.path) {
    throw new APIError(400, "Profile Image is required.");
  }

  const userExist = await User.findOne({ phone });
  if (userExist) {
    throw new APIError(400, "User Already Exist.");
  }

  const rounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, rounds);

  if (!hashedPassword) {
    throw new APIError(400, "Something went wrong.");
  }

  const image = await UploadOnCloudinary(file.path);

  const user = await User.create({
    name,
    phone,
    avatar: image.url,
    password: hashedPassword,
  });

  if (!user) {
    throw new APIError(400, "Something went wrong.");
  }
  return res.status(200).json({
    message: "Signup Successfully.",
    success: true,
  });
});

const LoginController = TryCatchHandler(async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = user.generateAuthToken();
  
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.status(200).json({
    message: "Logined Successfully.",
    success: true,
  });
});

const GetUserController = TryCatchHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    message: "User finded.",
    success: true,
    data: user,
  });
});

const LogoutController = TryCatchHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0,
  });

  return res.status(200).json({
    message: "Logout successfully.",
    success: true,
  });
});

const UpdateProfileController = TryCatchHandler(async (req, res) => {
  const { name, bio } = req.body;
  const file = req.file || "";

  const user = await User.findById(req.user._id);

  if (name) {
    user.name = name;
  }

  if (bio) {
    user.bio = bio;
  }

  if (file.path) {
    const image = await UploadOnCloudinary(file.path);
    user.avatar = image.url;
  }

  await user.save();

  return res.status(200).json({
    message: "Profile updated successfully.",
    success: true,
  });
});

const UpdatePasswordController = TryCatchHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  if (!oldpassword || !newpassword) {
    throw new APIError(404, "Passwords are required.");
  }

  const user = await User.findById(req.user._id);

  const isPassCorrect = await user.comparePassword(oldpassword);
  if (!isPassCorrect) {
    throw new APIError(400, "InValid Old password.");
  }

  const rounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newpassword, rounds);

  if (!hashedPassword) {
    throw new APIError(400, "Something went wrong.");
  }

  user.password = hashedPassword;
  await user.save();

  return res.status(200).json({
    message: "Password updated successfully.",
    success: true,
  });
});

export {
  HomeController,
  LoginController,
  SignupController,
  GetUserController,
  LogoutController,
  UpdateProfileController,
  UpdatePasswordController,
};
