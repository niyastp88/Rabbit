const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "User already exists" });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({
      name,
      email,
      password,
      mobile,
      emailOTP: otp,
      emailOTPExpire: Date.now() + 10 * 60 * 1000,
    });

    await user.save();

    await sendEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to email. Please verify.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    emailOTP: otp,
    emailOTPExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.emailOTP = undefined;
  user.emailOTPExpire = undefined;

  await user.save();

  const payload = { user: { id: user._id, role: user.role } };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "40h",
  });

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });
    if (!user.isVerified) {
  return res.status(403).json({ message: "Please verify your email first" });
}

    //Create JWT Playload
    const playload = { user: { id: user._id, role: user.role } };

    // Sign and return the token along with user data
    jwt.sign(
      playload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;
        console.log(token);
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.getUserProfile = async (req, res) => {
  res.json(req.user);
};
