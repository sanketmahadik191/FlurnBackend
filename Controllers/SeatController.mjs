import CustomError from "../Utils/CustomError.mjs";
import SeatsModel from "../Models/SeatsModel.mjs";
import BookingModel from "../Models/Booking.mjs";
import SeatsPricingModel from "../Models/SeatsPricingModel.mjs";
import UserModel from "../Models/UserModel.mjs";
import validator from "validator";
async function computeSeatPricing(seat_identifier) {
  // Note: The pricing should be returned based on the bookings previously made for
  // that seat class.

  // fetch seat fro db
  const seat = await SeatsModel.findOne({ seat_identifier });
  if (!seat) {
    throw new Error(`provided seatId :${seat_identifier} is invalid`);
  }

  // what is the seat class?
  const seatClass = seat?.seat_class;

  // how many total seats are there for current seat class?
  const totalSeatsMatchingCurrentClass = await SeatsModel.countDocuments({
    seat_class: "F",
  });

  // how many seats have been booked for current seat class?
  const totalSeatsBookedForCurrentSeatClass = await SeatsModel.countDocuments({
    seat_class: "F",
    is_booked: true,
  });

  const bookingPercentage =
    (totalSeatsBookedForCurrentSeatClass / totalSeatsMatchingCurrentClass) *
    100;
  const objSeatPricing = await SeatsPricingModel.findOne({
    seat_class: seatClass,
  });
  // ● Less than 40% of seats booked - use the min_price, if min_price is not
  // available, use normal_price
  let seatPrice = 0;

  if (bookingPercentage < 40) {
    seatPrice = objSeatPricing.min_price
      ? objSeatPricing.min_price
      : objSeatPricing.normal_price;
  }
  // ● 40% - 60% of seats booked - use the normal_price, if normal_price not
  // available, use max_price
  else if (bookingPercentage >= 40 && bookingPercentage <= 60) {
    seatPrice = objSeatPricing.normal_price
      ? objSeatPricing.normal_price
      : objSeatPricing.max_price;
  }
  // ● More than 60% of seats booked - use the max_price, if max_price is not
  // available, use normal_price
  else if (bookingPercentage > 60) {
    seatPrice = objSeatPricing.max_price
      ? objSeatPricing.max_price
      : objSeatPricing.normal_price;
  }
  console.log("Seat Price is : " + seatPrice);
  // mark seat as booked
  seat.is_booked = true;
  seat.save();
  return seatPrice;
}
async function getSeatPricing(req, res, next) {
  try {
    const { seatId } = req.body;
    if (!seatId) {
      throw new Error("missing seatId in the request");
    }

    const seat = await SeatsModel.findOne({ seat_identifier: seatId });
    console.log(seat);
    res.json({
      seatPrice: await computeSeatPricing(seatId),
      seat_class: seat?.seat_class,
      is_booked: seat?.is_booked,
    });
  } catch (error) {
    return next(
      new CustomError(
        500,
        "failed to get seat pricing, error: " + error.message
      )
    );
  }
}

async function getAllSeats(req, res, next) {
  try {
    const seats = await SeatsModel.find().sort({ seat_class: 1 });
    res.json({
      result: seats,
    });
  } catch (error) {
    return next(
      new CustomError(500, "failed to get seat the seats" + error.message)
    );
  }
}

const SeatController = { computeSeatPricing, getSeatPricing, getAllSeats };
export default SeatController;
