import Express from "express";
import controller from "./controller";
import auth from "../../../../helper/auth"


export default Express.Router()

.use(auth.tokenVerify)
.post("/createShop",controller.createShop)

.delete("/deleteShop",controller.deleteShop)
.put("/updateShop",controller.updateShop)
.get("/getShopNear",controller.getShopNear)

