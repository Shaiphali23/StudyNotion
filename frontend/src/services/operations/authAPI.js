import { setLoading, setToken } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
import { endpoints } from "../apis";
import { setUser } from "../../slices/profileSlice";

const {
  SEND_OTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSWORD_TOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SEND_OTP_API, {
        email,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verify-email");
      }
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  contactNumber,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
      console.log(response);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
      }
      dispatch(setToken(response.data.token));

      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;

      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("POST", RESETPASSWORD_TOKEN_API, {
        email,
      });
      console.log("Reset password token response", response);

      if (response.data.success) {
        toast.success(response.data.message);
      }
      setEmailSent(true);
    } catch (error) {
      console.error(
        "Error sending reset password token:",
        error.response ? error.response.data : error.message
      );
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });
      console.log("Password reset response", response);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    // dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}
