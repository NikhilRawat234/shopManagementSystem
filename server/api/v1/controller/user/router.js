import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth"

export default Express.Router()
.post('/userSignUp', controller.userSignup)
.put('/otpVerification',controller.otpVerification)
.put('/resendOtp',controller.resendOtp)
.post('/userLogin',controller.userLogin)
.get("/getProfile",auth.tokenVerify,controller.getProfile)
.put("/userEditProfile",auth.tokenVerify,controller.userEditProfile) 
.post("/emailVerification",auth.tokenVerify,controller.emailVerification)
.put("/verififcationLink/:id",controller.verififcationLink)
.put("/reSetPassword",auth.tokenVerify,controller.reSetPassword)
.put("/updateProfilePhoto",auth.tokenVerify,controller.updateProfilePhoto)
.get("/qrcodeGeneration",auth.tokenVerify,controller.qrcodeGeneration)
.get("/twoFa",controller.twoFa)
.post("/twoFaVerification" ,controller.twoFaVerification)
.post("/cronJob",auth.tokenVerify,controller.cronJob)




