import CustomError from "../Utils/CustomError.mjs";
import SeatsModel from "../Models/SeatsModel.mjs";
import BookingModel from "../Models/Booking.mjs";
import SeatsPricingModel from "../Models/SeatsPricingModel.mjs";
import UserModel from "../Models/UserModel.mjs";
import validator from "validator";
import SeatController from "./SeatController.mjs";

const createANewBooking = async (req, res, next) => {
  try {
    // append current user id
    req.body.bookedByUserId = req?.user?._id;

    req.body.amountsForTheBooking = 0;

    // just find seat pricing for any given seat
    let amountsForTheBooking = [];

    const promises = req.body.bookedSeatsIds.map((seatId) => {
      return new Promise(async (resolve, reject) => {
        try {
          amountsForTheBooking.push(
            await SeatController.computeSeatPricing(seatId)
          );
          resolve();
        } catch (error) {
          reject(error.message);
        }
      });
    });
    await Promise.all(promises);
    const totalAmountForTheBooking = amountsForTheBooking.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    const booking = await BookingModel({
      bookedSeatsIds: req.body.bookedSeatsIds,
      bookedByUserId: req.user._id,
      totalAmountForTheBooking,
    });
    booking.save();

    res.json({
      booking,
    });
  } catch (error) {
    next(
      new CustomError(
        500,
        "failed to uploadDefaultDataIntoDbFromCsvFile: " + error.message
      )
    );
  }
};

const retrieveBookings = async (req, res, next) => {
  try {
    const usernameOrEmailOrMobile = req?.body?.usernameOrEmailOrMobile;
    // first detect type of id
    let typeOfID = "username";
    if (validator.isEmail(usernameOrEmailOrMobile)) {
      typeOfID = "email";
    } else if (validator.isMobilePhone(usernameOrEmailOrMobile)) {
      typeOfID = "mobile";
    }
    console.log(typeOfID);

    if (!usernameOrEmailOrMobile) {
      throw new Error("Missing usernameOrEmailOrMobile inside request body");
    }
    // find the user id
    const user = await UserModel.findOne({
      [typeOfID]: usernameOrEmailOrMobile,
    });
    if (!user) {
      throw new Error(`User doesn't exist !`);
    }
    // find all the booking created by user
    const bookings = await BookingModel.find({ bookedByUserId: user?._id });
    res.json({
      bookings,
    });
  } catch (error) {
    next(new CustomError(500, "failed to retrieve bookings: " + error.message));
  }
};

const BookingController = { createANewBooking, retrieveBookings };
export default BookingController;
