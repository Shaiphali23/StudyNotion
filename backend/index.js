const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { dbConnect } = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const profileRoutes = require("./routes/profileRoutes");
const contactRoutes = require("./routes/contactRoutes");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
dotenv.config();

//middlewares
app.use(
  cors({
    origin: ["https://study-notion-dww6s9g2n-shaiphali-jaiswals-projects.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactRoutes);
app.use("/api/v1/payment", paymentRoutes);

//set up a basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Ed-tech API");
});

//DB connect
dbConnect();

//cloudinary connect
cloudinaryConnect();

//start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
