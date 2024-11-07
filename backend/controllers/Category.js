const Category = require("../models/Category");

//create Category
exports.createCategory = async (req, res) => {
  try {
    //fetch data from req body
    const { name, description } = req.body;

    //Data validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log("Category Created:", categoryDetails);

    //return response
    return res.status(200).json({
      success: true,
      message: "Category created Successfully",
      category: categoryDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the category",
      error: error.message,
    });
  }
};

//getAllCategory or fetch all category
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );

    return res.status(200).json({
      success: true,
      message: "All Category retrieved Successfully",
      categories: allCategories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching categories",
      error: error.message,
    });
  }
};

//category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    //get categoryId
    const { categoryId } = req.body;

    //get courses for specified category Id
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [{ path: "ratingAndReviews" }, { path: "instructor" }],
      })
      .exec();

    //validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    //when no courses are found for the selected category
    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    //get courses for other categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();

    // Flatten all courses from all categories and sort by the number of sales
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    //return response
    return res.status(200).json({
      success: true,
      message: "Category Page details retrieved successfully.",
      data: {
        selectedCategory,
        differentCategories,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching category page details.",
    });
  }
};
