import Joi from "joi";


import responseMessage from "../../../../../assets/responseMessage";
import response from "../../../../../assets/response";
import apiError from "../../../../helper/apiError";

import status from '../../../../enums/status';
import commonFunction from "../../../../helper/util"
import mongoose from "mongoose";

import productServices from "../../services/product";
const {
    findVendor,
    findCategoryById,
    productCreate,
    productDelete,
    productUpdate,
    getSpecifyProduct
    
} = productServices;

module.exports = {


    createProduct: async (req,res,next) => {
        const validationSchema = Joi.object({

            categoryId: Joi.string().required(),
            productName: Joi.string().required(),
            productPrice: Joi.string().required(),
            productDescription: Joi.string().required(),
            productImage: Joi.string().required()

        });

        try {
            const validatedBody = await validationSchema.validateAsync(req.body);
        const {categoryId,productDescription,productName,productPrice} = validatedBody;

        const getVendor = await findVendor({_id: req.userId})
        if(!getVendor){
            throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND)

        }else if (getVendor.status === status.BLOCK){
            throw apiError(responseMessage.BLOCK_BY_ADMIN)
        }
        const getCategory = await findCategoryById( categoryId);
        if(!getCategory){
            throw apiError.notFound({responseMessage: "ID is NOT found"})
        }
        const images = await commonFunction.getImageUrl(req.body.productImage);
        const object = {
            categoryId : categoryId,
            productName: productName,
            productPrice: productPrice,
            productDescription: productDescription,
            productImage: images,
        }
        const createdProduct = await productCreate(object);
            return res.json(
                new response(createdProduct, responseMessage.PRODUCT_ADDED)
            );

        } catch (error) {
            return next(error);
        }
        

    },


    deleteProduct: async (req, res, next)=> {
        
        try {
            
            const vendorExist = await findVendor(req.userId);
            if (!vendorExist) {
                throw apiError.notFound(responseMessage.NOT_FOUND);
            };
            const id = req.query.id;
            if (!id) {
                throw apiError.invalid(responseMessage.INVALID);
            }
             await productDelete( id );
            return res.json(new response(responseMessage.DELETE_SUCCESS));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    },


    editProduct :async (req,res,next) => {
        try {
            const vendorId = await findVendor( req.userId);
            if (!vendorId) {
                throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND);
            };
            const id = req.query.id;
            if (!id) {
                throw apiError.notFound(responseMessage.NOT_FOUND);
            }
            const { productName, productImage, productPrice, productDiscription} = req.body;
            const updated = await productUpdate({ _id: id }, { $set: req.body });
            return res.json(new response(updated, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            console.log("Error", error);
            return next(error);
        }
    },


    getProduct : async (req, res, next) => {
        try {
            const vendorData = await findVendor(req.userId);
            if(!vendorData){
                throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND)
            }
            
            // const id = req.query.id;
            // if(!id){
            //     throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND)
            // }
            const getAllCategory = await getSpecifyProduct({_id: req.query.id});
            
            return res.json(new response(getAllCategory, responseMessage.DATA_FOUND))
            
        } catch (error) {
            return next(error);
        }
    },


     getProductList: async(req, res, next) => {
        try {
            const { page, limit } = req.query;
            if (page < 1) {
                throw apiError.badRequest(responseMessage.PAGE_UNSPECIFIED);
            } else if (limit < 1) {
                throw apiError.badRequest(responseMessage.LIMIT_UNSPECIFIED);
            }
            const products = await paginate({}, page, limit);
            if (!products) {
                throw apiError.notFound(responseMessage.PRODUCT_NOT_FOUND);
            }
            return res.json(new successResponse(products, responseMessage.SUCCESS));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    },


    likedislike: async (req,res, next) => {
        try {
            
        } catch (error) {
            
        }
    }


}