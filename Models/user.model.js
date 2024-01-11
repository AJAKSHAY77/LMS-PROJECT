import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import crypto from "crypto"
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, `Name is required`],
      minlength: [5, `Name must be at least 5 characters`],
      maxlength: [50, `Name should be less than 50 characters`],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, `email is required`],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        `please fill a valid email address`,
      ],
    },
    password: {
      type: String,
      required: [true, `password is required`],
      minlength: [8, `Name must be at least 8 characters`],
      select: false,
    },

    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },

    role: {
      type: String,
      enum: [`USER`, `ADMIN`],
      default: `USER`,
    },

    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
    subscription: {
      id: String,
      status:String
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  generateJWTTOKEN: async function () {
    return await JWT.sign(
      {
        id: this.id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },

  camparePassword: async function (plaintextPassword) {
    return await bcrypt.compare(plaintextPassword, this.password);
  },

  generatePasswordResetToken: function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.forgetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.forgetPasswordExpiry = Date.now() + 20 * 60 * 1000; // 15 min from now
    return this.forgetPasswordToken; // Return the generated token
  },
};

const User = model("User", userSchema);

export default User;
