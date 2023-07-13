import config from "config";
import jwt from "jsonwebtoken";
import User from "../models/vendorSchema";
import responseMessage from "../../assets/responseMessage";
import apiError from "./apiError";

module.exports = {
     tokenVerify : async (req,res,next)=>{
        try {
           const token = req.headers["authorization"];
        if (!token){
            throw apiError.invalid(responseMessage.NO_TOKEN);
        }
        else{
           const data = await User.find({_id:token._id})
           if(data){
               jwt.verify(token,config.get("jwtsecret"),(err,result)=>{
                   if(err){
                       return res.status(501)
                       .json({responseCode : 501,
                       responseMessage:"Access Denied"})
                   }
                   else if (result){
                       req.userId=result._id;
                       return next();
                   }
               })
           }
        }
        } catch (error) {
           console.log(error);
           return res.status(501)
           .json({responseCode : 501,
               responseMessage:"Something went Wrong",next});
               
        }
   }
   
}