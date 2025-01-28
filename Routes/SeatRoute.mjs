import SeatController from "../Controllers/SeatController.mjs";
import e from "express";
import passport from "../Passport/passport-config.mjs";

const SeatRoute = e.Router();
SeatRoute.get(
  "/get-seat-pricing",
  passport.authenticate("jwt", { session: false }),
  SeatController.getSeatPricing
);
SeatRoute.get(
  "/get-all-seats",
  passport.authenticate("jwt", { session: false }),
  SeatController.getAllSeats
);
export default SeatRoute;
