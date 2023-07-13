import categoryModel from "../../../models/catagorySchema"
import shopModel from "../../../models/shopSchema"
import vendorModel from "../../../models/vendorSchema"
import userType from "../../../enums/userType";


const categoryServices = {

    findVendor: async (id) => {
        const admin = await vendorModel.findOne({ $and: [{ _id: id }, { userType: userType.VENDOR }] });
        return admin;
    },
    createCategory: async (obj) => {
        const createdCategory = await categoryModel.create(obj);
        return createdCategory;
    },
    findCategory: async (id) => {
        const result = await shopModel.find(id).populate("shopId");
        return result;
    },
    deleteCategory: async (id) => {
        const deletedShop = await categoryModel.findByIdAndDelete(id);
        return deletedShop;
    },
    updateCategory: async (id, obj) => {
        const updated = await categoryModel.findByIdAndUpdate(id, obj,{new:true});
        return updated;
    },
    

}

    module.exports = {categoryServices}