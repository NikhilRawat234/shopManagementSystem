
import { model, Schema } from "mongoose";
import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import  paginate  from "mongoose-paginate-v2";


const UserSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "CATEGORY",
      },
    productName: {
        type: String,
    },
    productPrice: {
        type: String
    },
    productDescription: {
        type: String
    },
    productImage: {
        type: String,
    },

}, { timestamps: true , strictPopulate: false});
UserSchema.plugin(paginate)
UserSchema.plugin(aggregatePaginate)

const product =  model("PRODUCT", UserSchema, "PRODUCT");
module.exports = product;