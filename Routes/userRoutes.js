import { Router } from "express";
import {
  getProfileDetail,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import { isLoggedIn } from "../Middleware/authmiddleware.js";
import upload from "../Middleware/mutler.middleware.js";

const userRouter = Router();

userRouter.post("/register",upload.single("avatar"),register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/me", isLoggedIn, getProfileDetail);

export default userRouter;
