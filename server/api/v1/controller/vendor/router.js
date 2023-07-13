import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth"

export default Express.Router()


    .get('/vendorLogin', controller.vendorLogin)
    .put('/resendOtp', controller.resendOtp)
    .put('/forgetPassword', controller.forgetPassword)
    

    .use(auth.tokenVerify)
    .put('/resetPassword', controller.resetPassword)
    .get('/getUserData', controller.getUserData)
    .put('/vendorUpdate', controller.vendorUpdate)
    .put('/imageUpload', controller.imageUpload)