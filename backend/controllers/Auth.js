const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//send OTP
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req body
    const { email } = req.body;

    //check if user already exist or not
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate unique OTP
    let otp;
    let result;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    } while (result);

    //save OTP to DB with expiration(5min)
    const otpExpiration = Date.now() + 5 * 60 * 1000;
    await OTP.create({ email, otp, expiresAt: otpExpiration });

    //return response
    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//sign up handler
exports.register = async (req, res) => {
  try {
    //data fetch from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //data validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2 password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    //check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //find most recent OTP for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    if (recentOtp.length === 0 || recentOtp[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //check if OTP is expired
    if (Date.now() > recentOtp[0].expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create entry in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber || null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    //delete OTP after successful registration
    await OTP.deleteMany({ email });

    //return res
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User registration failed, Please try again",
    });
  }
};

//login handler
exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;

    //validation of data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    //check user exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please sign up first",
      });
    }

    //generate JWT(token) after password matching
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};

//change password handler
exports.changePassword = async (req, res) => {
  try {
    //check if user exist
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { oldPassword, newPassword } = req.body;

    //validate the old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    //hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    //update the password
    user.password = hashedNewPassword;
    await user.save();

    //send password update confirmation email
    const title = "Password update confirmation";
    const body = `
    <p>Hello ${user.firstName}</p>
    <p>Your password has been successfully updated.</p>
    <p>Best Regards,<br>StudyNotion Team</p>
    `;

    await mailSender(user.email, title, body);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully and confirmation email sent",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not change the password, please try again",
    });
  }
};
