import shop from "../../../models/shopSchema"
import vendor from "../../../models/vendorSchema"

import userType from "../../../enums/userType";
import status from "../../../enums/status";


const shopServices = {
    createShop: async (obj) => {
        const created = await shop.create(obj);
        return created;
    },
    findData: async(query)=> {
        const find = await vendor
    },
    findVendor: async (id) => {
        const admin = await vendor.findOne({ $and: [{ _id: id }, { userType: userType.VENDOR }] });
        return admin;
    },
    deleteShop: async (id) => {
        const deletedShop = await shop.findByIdAndDelete(id);
        return deletedShop;
    },
    updateShop: async (id, obj) => {
        const updated = await shop.findByIdAndUpdate(id, obj);
        return updated;
    },
    
    findVendorDetails: async (id) => {
        const query = {$and:[{_id:id }, { status: status.ACTIVE }]};
        const userDetails = await vendor.findOne(query);
        return userDetails;
    },
    geonear: async (query) => {
        const result = await shop.aggregate(query);
        console.log(result);
        return result;
    },
    
    







}
module.exports = shopServices;