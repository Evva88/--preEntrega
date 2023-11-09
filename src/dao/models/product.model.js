import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  code: String,
  stock: Number,
  category: String,
  thumbnail: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Referencia al usuario que subió el producto
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model("products", productSchema);
