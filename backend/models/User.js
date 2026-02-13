const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },

    mobile: {
      type: String,
      required: false,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
            value,
          );
        },
        message:
          "Password must contain 8 characters including uppercase, lowercase, number and special character",
      },
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    emailOTP: String,
    emailOTPExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
