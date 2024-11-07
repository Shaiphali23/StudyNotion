const express = require("express");
const router = express.Router();

// import middleware
const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middlewares/auth");

//Course routes
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  editCourse,
  getInstructorCourses,
  getFullCourseDetails,
  deleteCourse,
} = require("../controllers/Course");
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse);
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.delete("/deleteCourse", deleteCourse);

//Category routes(can only be created by Admin)
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Category");
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

//Section routes
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");
router.post("/createSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);

//SubSection routes
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");
router.post("/createSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

//Rating/Review routes
const {
  createRating,
  getAverageRating,
  getAllRatings,
} = require("../controllers/RatingAndReview");
router.post("/createRatingAndReview", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllRatings", getAllRatings);

//course progress routes
const { updateCourseProgress } = require("../controllers/CourseProgress");
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

module.exports = router;
