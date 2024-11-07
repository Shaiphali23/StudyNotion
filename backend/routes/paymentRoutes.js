const express = require("express");
const router = express.Router();

// import middleware
const {
  auth,
  isStudent,
  isInstructor,
  isAdmin,
} = require("../middlewares/auth");
const {
  capturePayment,
  verifySignature,
  sendPaymentSuccessEmail,
} = require("../controllers/Payments");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifySignature);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

module.exports = router;
