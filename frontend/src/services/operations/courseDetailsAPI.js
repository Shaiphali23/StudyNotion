import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";
import { categories } from "../apis";

const {
  COURSE_DETAILS_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints;

// Fetching the available course categories
export const fetchCourseCategories = async () => {
  let result = [];
  try {
    // Making API request
    const response = await apiConnector("GET", categories.CATEGORIES_API);

    // Check if response is successful
    if (response?.data?.success) {
      //   toast.success(response.data.message);
      result = response?.data?.categories || [];
    } else {
      throw new Error(response?.data?.message || "Failed to fetch categories");
    }
  } catch (error) {
    console.log(
      "COURSE_CATEGORY_API API ERROR............",
      error?.response || error
    );

    const errorMessage =
      error?.response?.data?.message ||
      "An error occurred while fetching categories.";
    toast.error(errorMessage);
  }

  return result;
};

// add/create the course details
export const addCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE COURSE API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
      result = response?.data.course;
    }
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error);
    toast.error(error?.response?.data.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// edit the course details
export const editCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("EDIT COURSE API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
      result = response?.data?.data;
    }
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error);
    toast.error(error.response.data.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...");
  //   dispatch(setLoading(true));
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    console.log("COURSE_DETAILS_API API RESPONSE............", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response;
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error.data.message);
  }
  toast.dismiss(toastId);
  //   dispatch(setLoading(false));
  return result;
};

// create a section
export const createSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE SECTION API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
      result = response?.data?.updatedCourse;
    }
  } catch (error) {
    console.log("CREATE SECTION API ERROR............", error);
    toast.error(error.response.data.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// update a section
export const updateSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("PUT", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE SECTION API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
      result = response?.data?.data;
    }
  } catch (error) {
    console.log("UPDATE SECTION API ERROR............", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// delete a section
export const deleteSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE SECTION API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
      result = response?.data?.data;
    }
  } catch (error) {
    console.log("DELETE SECTION API ERROR............", error.message);
    toast.error(error.response?.data?.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// create a subsection
export const createSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE SUB-SECTION API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
      result = response?.data?.data;
    } else {
      throw new Error("Could Not Add Lecture");
    }
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR............", error);
    toast.error(error.response?.data?.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// update a subsection
export const updateSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("PUT", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE SUB-SECTION API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
      result = response?.data?.data;
    } else {
      throw new Error("Could Not Update Lecture");
    }
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error);
    toast.error(error.response?.data?.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE SUB-SECTION API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
      result = response?.data?.data;
    } else {
      throw new Error("Could Not Delete Lecture");
    }
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR............", error.message);
    toast.error(error.response?.data?.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// fetching all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("INSTRUCTOR COURSES API RESPONSE............", response);
    if (response?.data?.success) {
      // toast.success(response.data.message);
      result = response?.data?.data;
    }
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response);

    if (response.data?.success) {
      result = response.data.data;
    }
  } catch (error) {
    console.log(
      "COURSE_FULL_DETAILS_API API ERROR............",
      error.response
    );
    // Log additional details about the error
    if (error.response) {
      console.error("API Error Response:", error.response);
      console.error("Error Status:", error.response.status);
      console.error("Error Data:", error.response.data);
    } else if (error.request) {
      console.error("Request made but no response received:", error.request);
    } else {
      console.error("Error in setting up request:", error.message);
    }
  }
  toast.dismiss(toastId);
  return result;
};

// delete a course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE COURSE API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
    }
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
};

// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null;
  console.log("mark complete data", data);
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log(
      "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
      response
    );

    if (response.data.success) {
      toast.success("Lecture Completed");
      result = true;
    } else {
      console.error("API responded without success:", response);
      result = false;
    }
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error);
    const message =
      error.response?.data?.error ||
      error.message ||
      "Error completing lecture";
    toast.error(message);
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};

// create a rating for course
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE RATING API RESPONSE............", response);
    if (response?.data?.success) {
      toast.success(response.data.message);
    }
    success = true;
  } catch (error) {
    success = false;
    console.log("CREATE RATING API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return success;
};
