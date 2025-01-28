import BookingController from "../Controllers/BookingController.mjs";
import e from "express";
import passport from "../Passport/passport-config.mjs";
import BookingInputDataValidationMiddleware from "../Middlewares/BookingInputDataValidationMiddleware.mjs";

const BookingRoute = e.Router();
BookingRoute.post(
  "/create-a-new-booking",
  passport.authenticate("jwt", { session: false }),
  BookingInputDataValidationMiddleware,
  BookingController.createANewBooking
);
BookingRoute.get(
  "/retrieve-bookings",
  passport.authenticate("jwt", { session: false }),
  BookingController.retrieveBookings
);
export default BookingRoute;
