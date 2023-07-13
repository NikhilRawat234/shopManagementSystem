import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth"


export default Express.Router()

.use(auth.tokenVerify)
.post("/createProduct",controller.createProduct)
.delete('/deleteProduct',controller.deleteProduct)
.put('/editProduct', controller.editProduct)
.get('/getProduct', controller.getProduct)