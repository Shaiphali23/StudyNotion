import { studentEndpoints } from "../apis";
import toast from "react-hot-toast";
import rzpLogo from "../../assets/Logo/Logo-Full-Dark.png";
import { apiConnector } from "../apiConnector";
import { setLoading } from "../../slices/authSlice";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;
const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...");
  try {
    //Load Razorpay script
    console.log("Loading Razorpay SDK...");
    const response = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!response) {
      toast.error(
        "Razorpay SDK failed to load.Check your internet connection."
      );
      return;
    }
    console.log("Razorpay SDK loaded successfully.");

    //initiate the order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }
    console.log("Order initiated successfully:", orderResponse);

    //Options for Razorpay checkout
    const options = {
      key: razorpayKey,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for purchasing the course",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName}`,
        email: `${userDetails.email}`,
      },
      handler: function (response) {
        // Payment Success Handler
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.data.amount,
          token
        );
      },
    };

    // Open Razorpay payment
    console.log("Opening Razorpay payment...");
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment failed", function (response) {
      console.error("Payment failed response:", response);
      toast.error("Payment failed: " + response.error.description);
    });
  } catch (error) {
    console.error("Payment API ERROR....", error.message);
    toast.error("Could not complete payment. Please try again later.");
  } finally {
    toast.dismiss(toastId);
  }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying payment...");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Payment Successful, You are added to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR...", error.response.data);
    toast.error("Payment verification failed. Please try again.");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR...", error.message);
  }
}
