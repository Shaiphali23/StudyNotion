const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken - link send on email for reset password
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const { email } = req.body;

    //check user for this email, email validation
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Your email is not registered with us.",
      });
    }

    //generate random token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    const url = `${process.env.FRONTEND_URL}/update-password/${token}`;

    //send mail containing the url
    await mailSender(
      email,
      "Password reset Link",
      `Password reset Link: ${url}`
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully for password change",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong while resetting the password",
      error: error.message,
    });
  }
};

//resetPassword - store new password in the DB
exports.resetPassword = async (req, res) => {
  try {
    //fetch data from req body
    const { password, confirmPassword, token } = req.body;

    // Data validation
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Both password fields are required.",
      });
    }

    //data validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not match",
      });
    }

    //get user details from DB using token
    const userDetails = await User.findOne({ token: token });

    //if no entry - invalid token
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    //token time check
    if (Date.now() > userDetails.resetPasswordExpires) {
      return res.status(401).json({
        success: false,
        message: "Token has Expired, please regenerate your token",
      });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //update the password in the DB
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Password reset Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password",
      error: error.message,
    });
  }
};
