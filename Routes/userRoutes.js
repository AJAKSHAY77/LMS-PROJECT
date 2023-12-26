import { Router } from "express";
import {
  getProfileDetail,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import { isLoggedIn } from "../Middleware/authmiddleware.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/me", isLoggedIn, getProfileDetail);

export default userRouter;
