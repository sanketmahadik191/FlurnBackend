import mongoose from "mongoose";
const seatsSchema = new mongoose.Schema(
  {
    seat_identifier: { type: String, required: true },
    seat_class: { type: String, required: true, maxlength: 1 },
    is_booked: { type: Boolean, required: true, default: false },
    bookingID: { type: mongoose.Types.ObjectId, ref: "bookings" },
  },
  { timestamps: true }
);

const SeatsModel = mongoose.model("seats", seatsSchema);
export default SeatsModel;
