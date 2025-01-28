import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  bookedSeatsIds: [{ type: String, required: true }],
  bookedByUserId: { type: mongoose.Types.ObjectId, ref: "users" },
  totalAmountForTheBooking: { type: Number, required: true },
  currencySymbol: { type: String, required: true, default: "₹" },
});

const BookingModel = mongoose.model("bookings", bookingSchema);
export default BookingModel;
