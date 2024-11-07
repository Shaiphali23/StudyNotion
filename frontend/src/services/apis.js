const BASE_URL = process.env.REACT_APP_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
  SEND_OTP_API: `${BASE_URL}/auth/sendOtp`,
  SIGNUP_API: `${BASE_URL}/auth/register`,
  LOGIN_API: `${BASE_URL}/auth/login`,
  RESETPASSWORD_TOKEN_API: `${BASE_URL}/auth/reset-password-token`,
  RESETPASSWORD_API: `${BASE_URL}/auth/reset-password`,
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: `${BASE_URL}/profile/getAllUserDetails`,
  GET_USER_ENROLLED_COURSES_API: `${BASE_URL}/profile/getEnrolledCourses`,
  GET_ALL_INSTRUCTOR_DATA_API: `${BASE_URL}/profile/instructorDashboard`,
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  CREATE_COURSE_API: `${BASE_URL}/course/createCourse`,
  EDIT_COURSE_API: `${BASE_URL}/course/editCourse`,
  DELETE_COURSE_API: `${BASE_URL}/course/deleteCourse`,
  CREATE_SECTION_API: `${BASE_URL}/course/createSection`,
  UPDATE_SECTION_API: `${BASE_URL}/course/updateSection`,
  DELETE_SECTION_API: `${BASE_URL}/course/deleteSection`,
  CREATE_SUBSECTION_API: `${BASE_URL}/course/createSubSection`,
  UPDATE_SUBSECTION_API: `${BASE_URL}/course/updateSubSection`,
  DELETE_SUBSECTION_API: `${BASE_URL}/course/deleteSubSection`,
  GET_ALL_COURSE_API: `${BASE_URL}/course/getAllCourses`,
  COURSE_DETAILS_API: `${BASE_URL}/course/getCourseDetails`,
  GET_ALL_INSTRUCTOR_COURSES_API: `${BASE_URL}/course/getInstructorCourses`,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: `${BASE_URL}/course/getFullCourseDetails`,
  LECTURE_COMPLETION_API: `${BASE_URL}/course/updateCourseProgress`,
  CREATE_RATING_API: `${BASE_URL}/course/createRatingAndReview`,
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: `${BASE_URL}/course/getAllRatings`,
};

// CONTACT-US API
export const contactUsEndpoint = {
  CONTACT_US_API: `${BASE_URL}/reach/contact`,
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: `${BASE_URL}/profile/updateDisplayPicture`,
  UPDATE_PROFILE_API: `${BASE_URL}/profile/updateProfile`,
  CHANGE_PASSWORD_API: `${BASE_URL}/auth/changePassword`,
  DELETE_PROFILE_API: `${BASE_URL}/profile/deleteAccount`,
};

export const categories = {
  CATEGORIES_API: `${BASE_URL}/course/showAllCategories`,
};

// CATALOG PAGE DATA
export const catalogData = {
  CATALOG_PAGE_DATA_API: `${BASE_URL}/course/getCategoryPageDetails`,
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};
