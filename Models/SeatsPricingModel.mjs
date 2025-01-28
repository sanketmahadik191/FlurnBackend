import mongoose, { mongo } from "mongoose";
const seatsPricingSchema = new mongoose.Schema(
  {
    seat_class: { type: String, required: true, maxlength: 1 },

    min_price: {
      type: Number,
      set: (value) => (value ? parseFloat(value.replace(/[$]/g, "")) : null),
      default: null,
    },
    normal_price: {
      type: Number,
      set: (value) => (value ? parseFloat(value.replace(/[$]/g, "")) : null),
      default: null,
    },
    max_price: {
      type: Number,
      set: (value) => (value ? parseFloat(value.replace(/[$]/g, "")) : null),
      default: null,
    },
  },
  { timestamps: true }
);

const SeatsPricingModel = mongoose.model("seats-pricing", seatsPricingSchema);
export default SeatsPricingModel;
