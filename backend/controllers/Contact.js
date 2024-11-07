const Contact = require("../models/Contact");

const submitContact = async (req, res) => {
  const { firstName, lastName, email, countryCode, phoneNumber, message } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !countryCode ||
    !phoneNumber ||
    !message
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      countryCode,
      phoneNumber,
      message,
    });

    await newContact.save();
    res.status(200).json({
      success: true,
      message: "Contact Form Submitted Successfully.",
    });
  } catch (error) {
    console.error("Error saving contact form", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting the form.",
    });
  }
};

module.exports = { submitContact };
