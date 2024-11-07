const express = require("express");
const router = express.Router();
const {auth} = require("../middlewares/auth");

//Auth Routes
const {
  sendOTP,
  register,
  login,
  changePassword,
} = require("../controllers/Auth");
router.post("/sendOtp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.post("/changePassword",auth, changePassword);

// Reset Password routes
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;
