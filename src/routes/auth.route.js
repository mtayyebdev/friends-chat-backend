// Auth logic here, like login, signup....
import express from "express";
import {
  HomeController,
  GetUserController,
  LoginController,
  LogoutController,
  SignupController,
  UpdatePasswordController,
  UpdateProfileController,
} from "../controllers/auth.controller.js";
import { ValidateWithZod } from "../middlewares/ValidateWithZod.middleware.js";
import { VerifyUser } from "../middlewares/verifyUser.middleware.js";
import { LoginValidation, SignupValidation } from "../utils/zodValidation.js";
import { upload } from "../utils/uploadFile.js";

const AuthRouter = express.Router();

AuthRouter.route("/").get(HomeController);
AuthRouter.route("/signup").post(
  upload.single("avatar"),
  ValidateWithZod(SignupValidation),
  SignupController
);
AuthRouter.route("/login").post(
  ValidateWithZod(LoginValidation),
  LoginController
);
AuthRouter.route("/user").get(VerifyUser, GetUserController);
AuthRouter.route("/logout").get(VerifyUser, LogoutController);
AuthRouter.route("/updatepassword").patch(VerifyUser, UpdatePasswordController);
AuthRouter.route("/updateuser").patch(
  VerifyUser,
  upload.single("avatar"),
  UpdateProfileController
);

export { AuthRouter };
