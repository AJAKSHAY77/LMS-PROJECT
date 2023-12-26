import AppError from "../utils/error.utils.js";
import JWT from "jsonwebtoken"

export const isLoggedIn =  async (req,res,next) => {
    const { token } = req.cookies
    
    if (!token) {
        return next(new AppError('unauthenticated,please login again',401))
    }

    const userdetails =  await JWT.verify(token,process.env.JWT_SECRET)
    
    req.user = userdetails
    
    next()
}