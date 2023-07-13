import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth"


export default Express.Router()


    .get('/adminLogin', controller.adminLogin)
    .get('/getAllVendor', controller.getAllVendor)
    .get('/paginateAllVendorList', controller.paginateAllVendorList)


    .use(auth.tokenVerify)
    .post('/createVendor', controller.createVendor)
    .get('/getAdminData', controller.getAdminData)
    
    