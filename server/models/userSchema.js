import Mongoose from "mongoose";

import paginate from "mongoose-paginate-v2";


const userSchema = new Mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        mobileNumber: {
            type: String,
        },
        userName: {
            type: String,
        },
        address: {
            type: String,
        },
        countryCode: {
            type: String,
        },
        dateOfBirth: {
            type: String,
        },
        otp: {
            type: String,
        },
        otpExpireTime: {
            type: Date,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isVerifiedEmail: {
            type: Boolean,
            default: false,
        },

        userType: {
            type: String,
            default: status.ACTIVE
        },
        status: {
            type: String,

            default: userType.USER
        },
        profileImage: {
            type: String
        }

    },
    { timestamps: true }
);
Users.plugin(paginate);
const Users = mongoose.model("USER", userSchema)
module.exports = Users;