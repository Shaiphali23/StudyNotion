const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

//create section
exports.createSection = async (req, res) => {
  try {
    //fetch data from req body
    const { sectionName, courseId } = req.body;

    //data Validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create Section
    const newSection = await Section.create({ sectionName });

    //update course with section ObjectId
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //return response
    return res.status(201).json({
      success: true,
      message: "Section created Successfully",
      updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to create section",
      error: error.message,
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    //data input
    const { sectionName, sectionId, courseId } = req.body;

    //update section
    await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "Section updated Successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to update section, please try again",
      error: error.message,
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    //get id
    const { sectionId, courseId } = req.body;
    if (!sectionId || !courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid section or course ID" });
    }

    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true }
    );

    // Find the section to get its subsections
    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    // Delete the subsections associated with the section
    await SubSection.deleteMany({
      _id: { $in: section.subSection },
    });

    // Delete the section
    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "unable to delete section, please try again",
      error: error.message,
    });
  }
};
