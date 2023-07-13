import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const UserSchema = new mongoose.Schema({
    shopName: {
        type: String,
    },
    address: {
        type: String,
        required: true
      },
    owner: {
        type: String,
        
    },
    vendorGmail: {
        type: String,
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    imageUrl: {
        type: String
    },
    
    categoryID : {
        type: mongoose.Types.ObjectId,
        ref: "CATEGORY"
    }

},{timestamps: true});


UserSchema.index({ location: "2dsphere" })
UserSchema.plugin(aggregatePaginate)


const User = mongoose.model("SHOP",UserSchema, "SHOP");
module.exports = User;