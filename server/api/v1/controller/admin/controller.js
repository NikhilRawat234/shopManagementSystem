// const { joiPasswordExtendCore } = require("joi-password");
// const joiPassword = Joi.extend(joiPasswordExtendCore);
// import Mongoose from "mongoose";
// import _ from "lodash";
import Joi from "joi";
import Config from "config";

import apiError from '../../../../helper/apiError';
import response from '../../../../../assets/response';
import responseMessage from '../../../../../assets/responseMessage';

import bcrypt from 'bcryptjs';
import commonFunction from "../../../../helper/util";

// •••••••••••••••••••••••••••••••••••••••••ADMIN SERVICES•••••••••••••••••••••••••••••••••••••••••••••••••••••
import { userServices } from '../../services/vendor';
const { checkUserExists, paginate, createUser,findUser7,findUser6, findUser1, findUser3, } = userServices;
// •••••••••••••••••••••••••••••••••••••••••ADMIN SERVICES•••••••••••••••••••••••••••••••••••••••••••••••••••••

  import jwt from 'jsonwebtoken';
  import status, { ACTIVE } from '../../../../enums/status';
  import userType from "../../../../enums/usertype";
  const {otp ,otpExpiration} = commonFunction.getOTP();


module.exports = {

  // •••••••••••••••••••••••••••••••••••••••••ADMIN login•••••••••••••••••••••••••••••••••••••••••••••••••••••
    adminLogin : async (req,res,next) =>{
        const validationSchema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        });
        try {
            const validatedBody = await validationSchema.validateAsync(req.body)
            const {email,password} = validatedBody;
            const userResult = await findUser3({
                email: validatedBody.email},{userType: {$in: userType.ADMIN}});
            if(!userResult){
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        
              }else {
                const isMatch = bcrypt.compareSync(password,userResult.password);
            
                  const token = jwt.sign({ _id: userResult._id }, Config.get("jwtsecret"),{
                    expiresIn: "24h",
                  });
                  if(!isMatch){
                    throw apiError.invalid(responseMessage.INCORRECT_LOGIN);
                  }
                    return res.json(new response(token, responseMessage.LOGIN));
              }
              
                  
                  
                
        } catch (error) {
            return next(error)
        }
    },

  // •••••••••••••••••••••••••••••••••••••••••ADMIN login•••••••••••••••••••••••••••••••••••••••••••••••••••••

  
  // •••••••••••••••••••••••••••••••••••••••••create Vendor•••••••••••••••••••••••••••••••••••••••••••••••••••••
    createVendor: async (req, res,next)=>{
        const validationSchema = Joi.object({
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          email: Joi.string().required(),
          
          mobileNumber: Joi.string().required(),
          dateOfBirth: Joi.string().required(),
          password: Joi.string().required(),
          
          
        });
  
    try {
        
        const validatedBody = await validationSchema.validateAsync(req.body);
            
       
      const {firstName, email, mobileNumber,password} =  validatedBody;
    //   validatedBody.otp = otp;
    //   validatedBody.otpExpireTime = otpExpiration;
      validatedBody.userName = firstName.slice(0,4) + mobileNumber.slice(-4);
      
      const typeAdmin = await findUser7({_id: req.userId});
      if(!typeAdmin){
        throw apiError.badRequest(responseMessage.ADMIN_NOT_FOUND)
        
      }
      const userExist = await checkUserExists(mobileNumber, email);
      if (userExist) {
        if(req.body.email === userExist.email){
          throw apiError.conflict(responseMessage.EMAIL_ALREADY_EXIST)
        }else if(req.body.mobileNumber === userExist.mobileNumber){
          throw apiError.conflict(responseMessage.MOBILE_ALREADY_EXIST)
        }
      } else {
       
       

        await commonFunction.sendOtp(email,"Vendor email and password", `email: ${email}, password: ${password}` );
        const hassPass = bcrypt.hashSync(password,10)
        validatedBody.password = hassPass;
        const result =  await createUser(validatedBody);

         return res.json(new response(result, responseMessage.USER_CREATED));
      }
     
    
    } catch (error) {
      console.log(error);
      return next(error);
    }
    },

  // •••••••••••••••••••••••••••••••••••••••••create Vendor•••••••••••••••••••••••••••••••••••••••••••••••••••••  


  // •••••••••••••••••••••••••••••••••••••••••getAllVendor Vendor•••••••••••••••••••••••••••••••••••••••••••••••••••••
    getAllVendor: async (req,res,next) => {
      try {
        const allData = await findUser6({userType: userType.VENDOR},{ $and: [{ status: { $ne: status.DELETE } },{status: {$ne: status.BLOCK}}] });
        if(!allData){
          throw apiError.badRequest(responseMessage.USER_NOT_FOUND);
        }
        return res.json(new response(allData, "Users all data ."));
      } catch (error) {
        return next(error);
      }
    },

  // •••••••••••••••••••••••••••••••••••••••••getAllVendor Vendor•••••••••••••••••••••••••••••••••••••••••••••••••••••  

  
  // •••••••••••••••••••••••••••••••••••••••••getAdminData ••••••••••••••••••••••••••••••••••••••••••••••••••••• 
    getAdminData: async (req,res,next) => {
      try {
        const userResult = await findUser1({_id: req.userId, userType: {$in: [userType.ADMIN]}},{_id:0,password:0,status: 0,UserType : 0,
          otpExpireTime :  0,   otpVerified :0,createdAt : 0, updatedAt : 0})
        if(!userResult){
          throw apiError.notFound(responseMessage.ADMIN_NOT_FOUND);
        }
        return res.json(new response(userResult, responseMessage.ADMIN_DETAILS));
      } catch (error) {
        console.log(error)
        return next(error);
      }
    },

   // •••••••••••••••••••••••••••••••••••••••••getAdminData ••••••••••••••••••••••••••••••••••••••••••••••••••••• 
   
   
   
   // •••••••••••••••••••••••••••••••••••••••••paginateAllVendorList ••••••••••••••••••••••••••••••••••••••••••••••••••••• 
    paginateAllVendorList: async (req, res, next) => {
      try {
      
        const query = { $and: [{ userType: userType.VENDOR }, { status: status.ACTIVE }] };
        const paginateResult = await paginate(query, page, limit);
        if (!paginateResult) {
          throw apiError.notFound(responseMessages.NOT_FOUND);
        }
        return res.json(new response(paginateResult, responseMessage.SUCCESS));
      } catch (error) {
        console.log("Error", error);
        return next(error);
      }
    },

   // •••••••••••••••••••••••••••••••••••••••••paginateAllVendorList •••••••••••••••••••••••••••••••••••••••••••••••••••••  
}
