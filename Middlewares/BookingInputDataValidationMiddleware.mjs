import CustomError from "../Utils/CustomError.mjs";
import SeatsModel from "../Models/SeatsModel.mjs";
async function markIsBookedAsFalse(seat_identifier) {
  const seat = await SeatsModel.findOne({ seat_identifier });
  seat.is_booked = false;
  seat.save();
}

export default async function BookingInputDataValidationMiddleware(
  req,
  res,
  next
) {
  try {
    // just check whether the supplied bookings ids contains array of numbers
    const { bookedSeatsIds } = req.body;

    if (!bookedSeatsIds) {
      return next(
        new CustomError(400, "Missing array of bookedSeatsIds inside request !")
      );
    }
    // is it array?
    else if (!Array.isArray(bookedSeatsIds)) {
      return next(new CustomError(400, "provided bookedSeatsIds isn't array"));
    }

    try {
      // now checking if all of these seats are not booked yet
      const promises = bookedSeatsIds.map(async (seatId) => {
        // await markIsBookedAsFalse(seatId); // for testing purpose only
        return new Promise(async (resolve, reject) => {
          try {
            const seat = await SeatsModel.findOne({ seat_identifier: seatId });
            if (!seat) {
              throw new Error(`provided seatId: ${seatId} is invalid`);
            }
            // is it booked?
            console.log(seat.is_booked);
            if (seat.is_booked) {
              throw new Error(`provided seatId: ${seatId} is booked already!`);
            }

            resolve(seat);
          } catch (error) {
            console.log(error.message);
            reject(error.message);
          }
        });
      });

      await Promise.all(promises);
    } catch (error) {
      return next(new CustomError(400, error));
    }

    next();
  } catch (error) {
    return next(
      new CustomError(
        500,
        "Input validation failed for Booking Middleware, ERR: " + error.message
      )
    );
  }
}
