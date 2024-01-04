import { Router } from "express";
import {
  changePassword,
  forgotpassword,
  getProfileDetail,
  login,
  logout,
  register,
  resetpaassword,
  updateuser,
} from "../controllers/userController.js";
import { isLoggedIn } from "../Middleware/authmiddleware.js";
import upload from "../Middleware/mutler.middleware.js";

const userRouter = Router();

userRouter.post("/register",upload.single("avatar"),register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.get("/me", isLoggedIn, getProfileDetail);
userRouter.post("/reset", forgotpassword);
userRouter.post("/reset/:resetToken", resetpaassword);
userRouter.post('/change-password', isLoggedIn, changePassword)
userRouter.put("/update/:id", isLoggedIn, upload.single("avatar"),updateuser);


export default userRouter;
