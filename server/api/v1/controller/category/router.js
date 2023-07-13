import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth"

export default Express.Router()


.use(auth.tokenVerify)
.post('/createCategory', controller.createCategory)
.delete("/categoryDelete",controller.categoryDelete)
.put("/editCategory",controller.editCategory)
.get("/findAllCat",controller.findAllCat)
