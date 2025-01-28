import passport from "./Passport/passport-config.mjs";
import e from "express";
import morgan from "morgan";
import "dotenv/config";
import mongoose from "mongoose";
import UploadDefaultDataIntoDbFromCsvFileRouter from "./Routes/uploadDefaultDataIntoDbFromCsvFile.Route.mjs";
import UserRoute from "./Routes/UserRoute.mjs";
import BookingRoute from "./Routes/BookingRoute.mjs";
import SeatRoute from "./Routes/SeatRoute.mjs";

const PORT = process.env.PORT || 4000;
const app = e();
// Req logging
app.use(morgan("dev"));
// Making connection with DB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connection Established with Database!");
  })
  .catch((err) => {
    console.log("Unable to connect to DB!");
    console.log("Exiting...");
    process.exit(1);
  });

// allow me to export json from body
app.use(e.json());

// linking passport
app.use(passport.initialize());

// Routes
app.use(
  "/api/v1/uploadDefaultDataIntoDbFromCsvFile",
  UploadDefaultDataIntoDbFromCsvFileRouter
);
app.use("/api/v1/user", UserRoute);
app.use("/api/v1/booking", BookingRoute);
app.use("/api/v1/seat", SeatRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error!",
  });
});

app.listen(PORT, () => {
  console.log(`SERVER is up and running at port ${PORT}`);
});
