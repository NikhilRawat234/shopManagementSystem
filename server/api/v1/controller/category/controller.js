// const { joiPasswordExtendCore } = require("joi-password");
// const joiPassword = Joi.extend(joiPasswordExtendCore);
// import Mongoose from "mongoose";
// import _ from "lodash";
import Joi from "joi";
// import Config from "config";

import apiError from '../../../../helper/apiError';
import response from '../../../../../assets/response';
import responseMessage from '../../../../../assets/responseMessage';

// import bcrypt from 'bcryptjs';
// import commonFunction from "../../../../helper/util";


// import jwt from 'jsonwebtoken';
// import status, { ACTIVE } from '../../../../enums/status';
// import userType from "../../../../enums/usertype";


// •••••••••••••••••••••••••••••••••••••category services•••••••••••••••••••••••••••••••••••••••••••••••••••
import {categoryServices} from "../../services/category"
const { findVendor, createCategory, deleteCategory, updateCategory, findCategory } = categoryServices;
// •••••••••••••••••••••••••••••••••••••category services•••••••••••••••••••••••••••••••••••••••••••••••••••



module.exports = {


    // •••••••••••••••••••••••••••••••••••••••••create category•••••••••••••••••••••••••••••••••••••••••••••••••••••
    createCategory : async (req,res,next) => {
        const validationSchema = Joi.object({
            shopId: Joi.string().required(),
            category: Joi.string().required()
        });
        try {
            const validatedBody = await validationSchema.validateAsync(req.body);
            const {category, shopId}= validatedBody;
            const vendorData = await findVendor(req.userId)
            if(!vendorData){
                throw apiError.notFound(responseMessage.NOT_FOUND)
            }
            const shopID = await findShop({_id: shopId})
            if(!shopID){
                throw apiError.notfound(responseMessage.NOT_FOUND)
            }
            const object = {
                shopId: shopId,
                category: category
            }
            const categoryCreate = await createCategory(object);
            return res.json(new response(categoryCreate, responseMessage.CATEGORY_CREATED));
        } catch (error) {
            return next(error)
        }
    },

    // •••••••••••••••••••••••••••••••••••••••••create category•••••••••••••••••••••••••••••••••••••••••••••••••••••


    // •••••••••••••••••••••••••••••••••••••••••Delete category•••••••••••••••••••••••••••••••••••••••••••••••••••••
    categoryDelete: async (req,res,next) => {
        try {
            const vendorExist = await findVendor(req.userId);
            if (!vendorExist) {
                throw apiError.notFound(responseMessage.NOT_FOUND);
            };
            const id = req.query.id;
            if (!id) {
                throw apiError.invalid(responseMessage.INVALID);
            }
             await deleteCategory({ _id: id });
            return res.json(new response(responseMessage.DELETE_SUCCESS));
        } catch (error) {
            console.log(error);
            return next(error);
        }
    },

    // •••••••••••••••••••••••••••••••••••••••••Delete category•••••••••••••••••••••••••••••••••••••••••••••••••••••


    // •••••••••••••••••••••••••••••••••••••••••Edit category•••••••••••••••••••••••••••••••••••••••••••••••••••••
    editCategory : async (req,res,next) => {
        try {
            const vendorId = await findVendor( req.userId);
            if (!vendorId) {
                throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND);
            };
            const id = req.query.id;
            if (!id) {
                throw apiError.invalid(responseMessage.INVALID);
            }
            const { category} = req.body;
            const updated = await updateCategory({ _id: id }, { $set: req.body });
            return res.json(new response(updated, responseMessage.UPDATE_SUCCESS));
        } catch (error) {
            console.log("Error", error);
            return next(error);
        }
    },

    // •••••••••••••••••••••••••••••••••••••••••Edit category•••••••••••••••••••••••••••••••••••••••••••••••••••••


    // •••••••••••••••••••••••••••••••••••••••••Find  category•••••••••••••••••••••••••••••••••••••••••••••••••••••
    findAllCat: async (req,res,next) => {
        try {
            const vendorData = await findVendor(req.userId);
            if(!vendorData){
                throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND)
            }
            
            // const id = req.query.id;
            // if(!id){
            //     throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND)
            // }
            const getAllCategory = await findCategory({_id:req.query.id});
            console.log(getAllCategory);
            return res.json(new response(getAllCategory, responseMessage.DATA_FOUND))
            
        } catch (error) {
            return next(error);
        }
    }

    // •••••••••••••••••••••••••••••••••••••••••Find  category•••••••••••••••••••••••••••••••••••••••••••••••••••••
}