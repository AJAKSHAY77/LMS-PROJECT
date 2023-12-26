import User from "../Models/user.model.js";
import AppError from "../utils/error.utils.js";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  httpOnly: true,
  secure: true,
};

export const register = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(new AppError("Email is already Exists", 400));
  }

  const user = await User.create({
    fullname,
    password,
    email,
    avatar: {
      public_id: email,
      secure_url:
        "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
    },
  });

  if (!user) {
    return next(
      new AppError(" User Registration failed ,please try again", 400)
    );
  }

  //TODO: File upload
  await user.save();

  user.password = undefined;

  const token = await user.generateJWTTOKEN();

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "user registered successfully",
    user,
  });
};

export const login = async (req, res,next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }
    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || !user.camparePassword(password)) {
      return next(new AppError("Email or password  doest not match", 400));
    }

    const token = await user.generateJWTTOKEN();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "user loggedin successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};


export const logout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message:"user logget out successfully"
  })
};


export const getProfileDetail = async (req, res,next) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "user details",
      user,
    });
  } catch (error) {
          return next(new AppError("failed to fetch profile", 500));

  }

};
