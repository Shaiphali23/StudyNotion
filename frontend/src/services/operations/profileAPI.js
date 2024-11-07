import { profileEndpoints } from "../apis";
import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setLoading, setUser } from "../../slices/profileSlice";
import { logout } from "./authAPI";

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_ALL_INSTRUCTOR_DATA_API,
} = profileEndpoints;

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userImg = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;

      dispatch(setUser({ ...response.data.data, image: userImg }));
    } catch (error) {
      dispatch(logout(navigate));
      toast.error(error.response.data.message);
      console.error(error);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading enrolled courses...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    toast.error(error.response?.data?.message);
  }
  toast.dismiss(toastId);
  return result;
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_DATA_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("GET INSTRUCTOR DATA", response);
    result = response?.data?.courses;
    
  } catch (error) {
    console.log("GET_INSTRUCTOR_API_ERROR", error);
    toast.error("Could not get instructor data");
  }
  toast.dismiss(toastId);
  return result;
}
