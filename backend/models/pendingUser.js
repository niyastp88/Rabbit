const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    mobile: String,
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("PendingUser", pendingUserSchema);
