import categoryModel from "../../../models/catagorySchema";
import shopModel from "../../../models/shopSchema";
import vendorModel from "../../../models/vendorSchema";
import productModel from "../../../models/productSchema";
import userType from "../../../enums/userType";

module.exports = {
    findVendor: async (id) => {
        const query = await vendorModel.findOne({
            $and: [{ _id: id }, { userType: { $in: userType.VENDOR } }],
        });
        return query;
    },
    findCategoryById: async (id) => {
        return await categoryModel.findOne({ _id: id });
    },
    productCreate: async (obj) => {
        const categorycreated = await productModel.create(obj);
        return categorycreated;
    },
    findProductById: async (id) => {
        return await productModel.findOne({ _id: id });
    },
    productDelete: async (id) => {
        return await productModel.findByIdAndDelete({ _id: id });
    },
    productUpdate: async (id, query) => {
        return await productModel.findByIdAndUpdate(id, query, { new: true });
    },

    getSpecifyProduct : async (id) => {
        return await productModel.findOne(id).populate("categoryId")
    },
    paginate: async (query, page, limit) => {
        try {
          const options = {
            page: parseInt(page) || parseInt(1),
            limit: parseInt(limit) || parseInt(5),
          };
          return await productModel.paginate(query, options)
          
          
        } catch (error) {
          console.log(error);
          return error;
        }
      },
    
}   



