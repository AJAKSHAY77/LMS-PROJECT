import AppError from "../utils/error.utils.js";
import JWT from "jsonwebtoken"

export const isLoggedIn =  async (req,res,next) => {
    const { token } = req.cookies
    
    if (!token) {
        return next(new AppError('unauthenticated,please login again',401))
    }

    const userdetails = await JWT.verify(token, process.env.JWT_SECRET);
    
    req.user = userdetails
    
    next()
}

// Middleware to check if user is admin or not
export const authorizeRoles = (...roles) => async (req, res, next) => {
     const currentUser = req.user.role;

    if (!roles.includes(currentUser)) {
      return next(
        new AppError("You do not have permission to view this route", 403)
      );
    }

    next();
  };

