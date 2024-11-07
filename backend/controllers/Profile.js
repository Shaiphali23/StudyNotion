const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const {
  convertSecondsToDuration,
} = require("../utils/convertSecondsToDuration");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");

//update profile
exports.updateProfile = async (req, res) => {
  try {
    //fetch data
    const { dateOfBirth, about, contactNumber, gender } = req.body;

    //get userId
    const id = req.user.id;

    //validation
    if (!dateOfBirth || !about || !contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    //find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    //return response
    return res.status(200).json({
      success: true,
      message: "Profile updated Successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to update profile",
      error: error.message,
    });
  }
};

//delete account
exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const userId = req.user.id;

    //validation
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //delete profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    //delete user
    await User.findByIdAndDelete(userId);

    //return response
    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to delete account",
      error: error.message,
    });
  }
};

//get all user details
exports.getAllUserDetails = async (req, res) => {
  try {
    //get id
    const userId = req.user.id;

    //get user details
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    //return response
    return res.status(200).json({
      success: true,
      message: "User data fetched Successfully",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user data",
      error: error.message,
    });
  }
};

//update display picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No display picture provided.",
      });
    }

    //upload image to cloudinary
    const uploadedImage = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME
    );
    console.log(uploadedImage);

    //update user's profile with new image URL
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: uploadedImage.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Profile Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update display picture.",
      error: error.message,
    });
  }
};

//get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    //fetch user details and populate enrolled courses
    let userDetails = await User.findById({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    // If no courses found
    if (!userDetails.courses || userDetails.courses.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No enrolled courses found.",
      });
    }

    //convert userDetails to a plain object
    userDetails = userDetails.toObject();

    //courses to calculate total duration and subSection count
    for (let course of userDetails.courses) {
      let totalDurationInSeconds = 0;
      let subSectionLength = 0;

      //calculate total duration and subsection count
      for (let content of course.courseContent) {
        const subSectionDuration = content.subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        totalDurationInSeconds += subSectionDuration;
        subSectionLength += content.subSection.length;
      }

      // Set total duration in a human-readable format
      course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

      // Fetch course progress for the current course
      const courseProgressCount = await CourseProgress.findOne({
        courseId: course._id,
        userId: userId,
      });

      const completedVideos = courseProgressCount?.completedVideos.length || 0;

      // Calculate progress percentage
      if (subSectionLength === 0) {
        course.progressPercentage = 100;
      } else {
        // To make it up to 2 decimal points
        const multiplier = Math.pow(10, 2);
        course.progressPercentage =
          Math.round((completedVideos / subSectionLength) * 100 * multiplier) /
          multiplier;
      }
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching enrolled courses.",
      error: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
      return courseDataWithStats;
    });

    res.status(200).json({
      courses: courseData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
