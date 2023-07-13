import mongoose from "mongoose";
import userType from "../enums/userType";
import bcrypt from "bcryptjs";
import status from "../enums/status";
import paginate from "mongoose-paginate-v2"
import { string } from "joi";

const UserSchema  = new mongoose.Schema({
    email: {
        type: String
      },
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
      
      mobileNumber: {
        type: String
      },
      userName: {
        type: String
      },
      password: {
        type: String
      },
      dateOfBirth: {
        type: String
      },
      
      otp: {
        type: String
      },
      otpExpireTime: {
        type: String
      },
      otpVerified: {
        type: Boolean,
        default: false
      },
      emailVerified: {
        type: Boolean,
        default: false
      },
      profileImage: {
        type: String
      },
      userType: {
        type: String,
        default: userType.VENDOR
      },
      status: {
        type: String,
        default: status.ACTIVE
      },
      
     

},
{timestamps: true}
);
UserSchema.plugin(paginate);
const User = mongoose.model("USER", UserSchema, "USER");
module.exports =  User;

const admin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ userType: userType.ADMIN });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const obj = {
      firstName: "Nikhill",
      lastName: "Bhai",
      email: "nikhilrawat281@gmail.com",
      mobileNumber: "5646456456",
      countryCode: "+91",
      UserName: "Admin457",
      password: bcrypt.hashSync("Nikhil12345", 10),
      address: "Lucknow",
      dateOfBirth: "2000",
      userType: userType.ADMIN,
      Status: "Active"
    };

    await User.create(obj);
    console.log("Admin created:", obj);
  } catch (error) {
    console.log(error);
  }
};

admin();
