
import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const UserSchema =  new mongoose.Schema({
    shopId: {
        type: mongoose.Types.ObjectId,
        ref: "SHOP"
    },
    category: {
        type: String

    }
}, {timestamps: true} );

UserSchema.plugin(aggregatePaginate)
const User = mongoose.model("CATEGORY", UserSchema, "CATEGORY")
module.exports= User;

