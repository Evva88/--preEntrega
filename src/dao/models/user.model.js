import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  role: String,
  cart: Array,
  isPremium: { type: Boolean, default: false }, // Nuevo campo para usuario premium
});

export const userModel = mongoose.model("User", userSchema);
