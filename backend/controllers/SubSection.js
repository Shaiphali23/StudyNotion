const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create subSection
exports.createSubSection = async (req, res) => {
  try {
    //fetch data
    const { sectionId, title, description } = req.body;
    //extract video
    const videoFile = req.files.videoFile;

    //data validation
    if (!sectionId || !title || !description || !videoFile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Upload video to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      videoFile,
      process.env.FOLDER_NAME
    );

    //create a subsection
    const SubSectionDetails = await SubSection.create({
      title: title,
      description: description,
      videoUrl: uploadDetails.secure_url,
      timeDuration: `${uploadDetails.duration}`,
    });

    //update section with this subsection ObjectId
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    //return response
    return res.status(201).json({
      success: true,
      message: "Sub Section created Successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error in createSubSection:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create sub section.",
    });
  }
};

//update subSection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }

    if(req.files && req.files.videoFile !== undefined){
      const video = req.files.videoFile;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = uploadDetails.duration;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Sub Section updated Successfully",
      data:updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update sub section.",
      error: error.message,
    });
  }
};

//delete subSection
exports.deleteSubSection = async (req, res) => {
  try {
    //get id from params
    const { sectionId, subSectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );

    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });
    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Sub Section deleted Successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error deleting subsection:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete sub section.",
      error: error.message,
    });
  }
};
