import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setUser, setLoading } from "../../slices/profileSlice";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        const userImage = response.data.data.image;

        dispatch(
          setUser({
            ...response.data.data,
            image: userImage,
          })
        );
        // Update local storage
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        let existingUser = {};
        try {
          existingUser = JSON.parse(localStorage.getItem("user")) || {};
        } catch {}

        const updatedUser = {
          ...existingUser,
          ...(response.data.updatedUser || {}),
          additionalDetails: {
            ...existingUser.additionalDetails,
            ...response.data.profileDetails,
          },
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        dispatch(setUser(updatedUser));
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

export function changePassword(token, formData) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector(
        "POST",
        CHANGE_PASSWORD_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        try {
          const existingUser = JSON.parse(localStorage.getItem("user")) || {};
          localStorage.setItem(
            "user",
            JSON.stringify({ ...existingUser, ...(response.data.user || {}) })
          );
        } catch {}
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to change password");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(logout(navigate));
      } else {
        toast.error(response.data.message); // Show error message if success is false
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete account");
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}
