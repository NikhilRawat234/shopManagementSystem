import User from "../../../models/vendorSchema";
import status from "../../../enums/status";
import usertype from "../../../enums/userType";
 

const userServices = {
    userCheck : async (userId) => {
        let query = {$and: [{status : {$ne: status.DELETE}},{$or: [{email: userId}, {mobileNumber: userId}]}]}
        return await User.findOne(query);
    },
    checkUserExists: async (mobileNumber, email) => {
        let query = { $and: [{ status: { $ne: status.DELETE } },{status: {$ne: status.BLOCK}}, { $or: [{ email: email }, { mobileNumber: mobileNumber }] }] }
        return await User.findOne(query);
      },
      emailMobileExist: async (mobileNumber, email, id) => {
        let query = { $and: [{ status: { $ne: status.DELETE } }, { _id: { $ne: id } }, { $or: [{ email: email }, { mobileNumber: mobileNumber }] }] }
        return await User.findOne(query);
      },
      createUser: async (insertObj) => {
        return await User.create(insertObj);
      },
      findUser: async (email) => {
        return await User.findOne({email:email});
      },
      findUser2: async (query) => {
        return await User.updateOne(query);
      },
      findUser3: async (query) => {
        return await User.findOne(query);
      },
      findUser4 :async (query,obj) => {
        return await User.findOneAndUpdate(query,obj, {new:true})
      },
      findUser1: async (...args) => {
        return await User.findById(args[0],args[1]);
      },
      
      updateUser: async (query,updateObj) => {
        return await User.updateOne(query,updateObj,{new:true});
      },
      findUser6: async (query) => {
        return await User.find(query);
      },
      findUser7: async (query) => {
        return await User.findById(query);
      },
      paginate: async (query, page, limit) => {
        try {
          const options = {
            page: parseInt(page) || parseInt(1),
            limit: parseInt(limit) || parseInt(5),
          };
          return await User.paginate(query, options)
          
          
        } catch (error) {
          console.log(error);
          return error;
        }
      },
}


module.exports = {userServices}; 