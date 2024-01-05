import crypto from "crypto"
import User from "../Models/user.model.js";
import sendEmail from "../utils/Sendemail.js";
import AppError from "../utils/error.utils.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

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
  if (req.file) {
    console.log(req.file);
    try {
      const uloadingImage = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 200,
        height: 200,
        gravity: "faces",
        crop: "fill",
      });
      if (uloadingImage) {
        user.avatar.public_id = uloadingImage.public_id;
        user.avatar.secure_url = uloadingImage.secure_url;

        //Remove file from local
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || "File not uploaded,please try again", 500)
      );
    }
  }
  await user.save();

  const token = await user.generateJWTTOKEN();

  res.cookie("token", token, cookieOptions);
  user.password = undefined;

  res.status(201).json({
    success: true,
    message: "user registered successfully",
    user,
  });
};

export const login = async (req, res, next) => {
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
    message: "user logget out successfully",
  });
};

export const getProfileDetail = async (req, res, next) => {
  try {
    const userId = req.user.id;

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

export const forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is Required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Email is not resgistered", 400));
  }

 const resetToken = user.generatePasswordResetToken();
 console.log("Generated Token:", resetToken);

 // Now you can use the resetToken variable
 const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
 console.log("Reset Password URL:", resetPasswordURL);

 await user.save();


  
  const subject = "Reset password";

  const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}.\n If you have not requested this, kindly ignore.`;
  try {
    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: `Reset password Token has been sent to ${email} successfully`,
    });
  } catch (e) {
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;

    await user.save();
    return next(new AppError(e.message, 500));
  }
};
export const resetpaassword = async(req,res,next) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  console.log(password);

  const forgetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Check if password is not there then send response saying password is required
  if (!password) {
    return next(new AppError('Password is required', 400));
  }

  console.log(forgetPasswordToken);

  // Checking if token matches in DB and if it is still valid(Not expired)
  const user = await User.findOne({
    forgetPasswordToken,
    forgetPasswordExpiry:{ $gt: Date.now() },
  });
  console.log(`User,${user}`);

  // If not found or expired send the response
  if (!user) {
    return next(
      new AppError('Token is invalid or expired, please try again', 400)
    );
  }

  // Update the password if token is valid and not expired
  user.password = password;

  // making forgotPassword* valus undefined in the DB
  user.forgetPasswordToken = undefined;
  user.forgetPasswordExpiry = undefined;

  // Saving the updated user values
  await user.save();

  // Sending the response when everything goes good
  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });



};

export const changePassword = async (req,res,next) => {

  const { oldPassword, newPassword } = req.body;
  const { id } = req.user; // because of the middleware isLoggedIn

  // Check if the values are there or not
  if (!oldPassword || !newPassword) {
    return next(
      new AppError("Old password and new password are required", 400)
    );
  }

  // Finding the user by ID and selecting the password
  const user = await User.findById(id).select("+password");

  // If no user then throw an error message
  if (!user) {
    return next(new AppError("Invalid user id or user does not exist", 400));
  }

  // Check if the old password is correct
  const isPasswordValid = await user.comparePassword(oldPassword);

  // If the old password is not valid then throw an error message
  if (!isPasswordValid) {
    return next(new AppError("Invalid old password", 400));
  }

  // Setting the new password
  user.password = newPassword;

  // Save the data in DB
  await user.save();

  // Setting the password undefined so that it won't get sent in the response
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
  
}

export const updateuser = async (req,res,next) => {
  const { fullname } = req.body;
  const { id } = req.user.id;

  
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("Invalid user id or user does not exist"));
  }

  if (req.fullname) {
    user.fullname = fullname;
  }

  // Run only if user sends a file
  if (req.file) {
    // Deletes the old image uploaded by the user
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms", // Save files in a folder named lms
        width: 250,
        height: 250,
        gravity: "faces", // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        crop: "fill",
      });

      // If success
      if (uloadingImage) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = uloadingImage.public_id;
        user.avatar.secure_url = uloadingImage.secure_url;

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || "File not uploaded, please try again", 400)
      );
    }
  }

  // Save the user object
  await user.save();

  res.status(200).json({
    success: true,
    message: "User details updated successfully",
  });
} 
