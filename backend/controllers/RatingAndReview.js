const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//create rating/reviews
exports.createRating = async (req, res) => {
  try {
    //get user id
    const userId = req.user.id;
    const { courseId, rating, review } = req.body;

    //validate data
    if (!courseId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Course ID, rating, and review are required.",
      });
    }

    //check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course.",
      });
    }

    //check if User already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user.",
      });
    }

    //create a new rating and review
    const newRatingAndReview = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating,
      review,
    });

    //update the course with the new rating
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { ratingAndReviews: newRatingAndReview._id },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Rating and review created successfully.",
      ratingAndReview: newRatingAndReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get Average rating for a course
exports.getAverageRating = async (req, res) => {
  try {
    //get course Id
    const { courseId } = req.params;

    //calculate avg rating
    const result = await RatingAndReview.aggregate([
      //Match all reviews
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      //Group these reviews and calculate the average
      {
        $group: {
          _id: null,//group everything together
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      // Send the average rating as response
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
        message: "Average rating retrieved successfully.",
      });
    }

    //if no rating/review exist
    return res.status(200).json({
      success: true,
      message: "Average rating is 0, no rating given till now.",
      averageRating: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error calculating the average rating.",
      error: error.message,
    });
  }
};

//get all rating/reviews
exports.getAllRatings = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    //return res
    return res.status(200).json({
      success: true,
      message: "All reviews fetched Successfully",
      data: allReviews,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "An error occurred while fetching reviews.",
      message: error.message,
    });
  }
};
