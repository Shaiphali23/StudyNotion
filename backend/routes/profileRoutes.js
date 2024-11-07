const express = require("express");
const router = express.Router();
// import middleware
const { auth } = require("../middlewares/auth");

const {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard
} = require("../controllers/Profile");

router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteAccount",auth, deleteAccount);
router.get("/getAllUserDetails", auth, getAllUserDetails);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/getEnrolledCourses",auth, getEnrolledCourses);
router.get("/instructorDashboard",auth, instructorDashboard);

module.exports = router;
