import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  drink: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating w/ validation
});

export default mongoose.model("Purchase", PurchaseSchema);
