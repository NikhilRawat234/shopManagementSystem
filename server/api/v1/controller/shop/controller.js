
import apiError from "../../../../helper/apiError";
import Config from "config";


import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import commonFunction from "../../../../helper/util";

import Joi from "joi"

import shopServices from "../../../v1/services/shop";
const { createShop, findVendor, deleteShop, updateShop, findVendorDetails, geonear } = shopServices;

module.exports = {


    // •••••••••••••••••••••••••••••••••••••••••Create Shop•••••••••••••••••••••••••••••••••••••••••••••••••••••
     createShop: async(req, res, next) => {

        const validationSchema = Joi.object({
            shopName: Joi.string().required(),
            address: Joi.string().required(),
            longitude: Joi.string().required(),
            latitude: Joi.string().required(),
            imageUrl: Joi.string().required()

            // 28.522286488839896, 77.27957682388322
        })
        try {
            const validatedBody = await validationSchema.validateAsync(req.body);
            const {shopName, address, longitude,latitude,imageUrl} = validatedBody
            const vendor = await findVendor( req.userId );
            if (!vendor) {
                throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND);
            }
            // const unique = await 
            const images = await commonFunction.getImageUrl(req.body.imageUrl);
            const obj = {
                shopName: shopName,
                address: address,
                owner: vendor.firstName,
                vendorGmail: vendor.email,
                location: {
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                imageUrl: images
            }
            const shopCreate = await createShop(obj);
            res.json(new response(shopCreate, responseMessage.SHOP_CREATED));
        } catch (error) {
            console.log("Error", error);
            return next(error);

        }
    },

    // •••••••••••••••••••••••••••••••••••••••••Create Shop•••••••••••••••••••••••••••••••••••••••••••••••••••••


    // •••••••••••••••••••••••••••••••••••••••••delete shop•••••••••••••••••••••••••••••••••••••••••••••••••••••
     deleteShop : async (req, res, next) => {
        try {
            const admin = await findVendor(req.userId);
            if (!admin) {
                throw apiError.notFound(responseMessage.ADMIN_NOT_FOUND);
            };
            const id = req.query.id;
            if (!id) {
                throw apiError.invalid(responseMessage.INVALID);
            }
             await deleteShop({ _id: id });
            return res.json(new response(responseMessage.DELETE_SUCCESS));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    },

    // •••••••••••••••••••••••••••••••••••••••••delete shop•••••••••••••••••••••••••••••••••••••••••••••••••••••


    // •••••••••••••••••••••••••••••••••••••••••updateShop•••••••••••••••••••••••••••••••••••••••••••••••••••••
     updateShop: async (req, res, next) => {
        try {
            const admin = await findVendor( req.userId);
            if (!admin) {
                throw apiError.notFound(responseMessage.ADMIN_NOT_FOUND);
            };
            const id = req.query.id;
            if (!id) {
                throw apiError.invalid(responseMessage.INVALID);
            }
            const { latitude, longitude, shopName, image } = req.body;
            const updated = await updateShop({ _id: id }, { $set: req.body });
            return res.json(new response(updated, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            console.log("Error", error);
            return next(error);
        }
    },

    // •••••••••••••••••••••••••••••••••••••••••delete shop•••••••••••••••••••••••••••••••••••••••••••••••••••••
   

    // •••••••••••••••••••••••••••••••••••••••••getshop geonear shop•••••••••••••••••••••••••••••••••••••••••••••••••••••
     getShopNear: async (req, res, next) => {
        const validationSchema = Joi.object({
            longitude: Joi.string().required(),
            latitude: Joi.string().required(),

        });
        try {
            const validatedBody = await validationSchema.validateAsync(req.body);
            const { longitude,latitude} = validatedBody
            const vendor = await findVendor( req.userId );
            if (!vendor) {
                throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND);
            }
            const shopNearMe = await geonear([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [ parseFloat(longitude),parseFloat(latitude)],
                        },
                        key:"location",
                        distanceField: "dist-calculated",
                        maxDistance: parseFloat(1000) * 1609,
                        spherical: true,
                    }
                }
            ]);
            if(!shopNearMe){
                throw apiError.badRequest(responseMessage.NOT_FOUND)
            }
            return res.json(new response(shopNearMe, responseMessage.SUCCESS));
        } catch (error) {
            return next(error)
        }
    }
    // •••••••••••••••••••••••••••••••••••••••••getshop geonear shop•••••••••••••••••••••••••••••••••••••••••••••••••••••

    
}

