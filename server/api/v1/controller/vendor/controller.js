import Joi from "joi";
// const { joiPasswordExtendCore } = require("joi-password");
// const joiPassword = Joi.extend(joiPasswordExtendCore);
// import Mongoose from "mongoose";
// import _ from "lodash";
import Config from "config";
import apiError from '../../../../helper/apiError';
import response from '../../../../../assets/response';
import bcrypt from 'bcryptjs';
import responseMessage from '../../../../../assets/responseMessage';
import commonFunction from "../../../../helper/util";
const { otp, otpExpiration } = commonFunction.getOTP();


// •••••••••••••••••••••••••••••••••• services •••••••••••••••••••••••••••••••••••••••••••••••••••
import { userServices } from '../../services/vendor';
const { checkUserExists,
  emailMobileExist, paginate, createUser, findUser7, findUser4,
  findUser1, findUser3, findUser, findAllUser, updateUser, updateUserById,
} = userServices;
// •••••••••••••••••••••••••••••••••• services •••••••••••••••••••••••••••••••••••••••••••••••

import jwt from 'jsonwebtoken';
import status, { ACTIVE } from '../../../../enums/status';
import userType from "../../../../enums/usertype";


module.exports = {


  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••
  vendorLogin: async (req, res, next) => {
    const validationSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required()
    });
    try {
      const validatedBody = await validationSchema.validateAsync(req.body)
      const { email, password } = validatedBody;
      const userResult = await findUser3({
        email: validatedBody.email
      }, { userType: { $in: userType.VENDOR } });
      if (!userResult) {
        throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND);

      } else {
        const isMatch = bcrypt.compareSync(password, userResult.password);

        const token = jwt.sign({ _id: userResult._id }, Config.get("jwtsecret"), {
          expiresIn: "24h",
        });
        if (!isMatch) {
          throw apiError.invalid(responseMessage.INCORRECT_LOGIN);
        }
        return res.json(new response(token, responseMessage.LOGIN));
      }




    } catch (error) {
      return next(error)
    }
  },

  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••


  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••
  resendOtp: async (req, res, next) => {
    const validationSchema = Joi.object({
      email: Joi.string().required(),

    });

    try {

      const validatedBody = await validationSchema.validateAsync(req.body);

      const { email, otp } = validatedBody;

      const userResult = await findUser3({ email: email, userType: userType.VENDOR });

      if (!userResult) {
        throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND);
      }
      validatedBody.otp = commonFunction.getOTP().otp;
      validatedBody.otpExpireTime = Date.now() + 180000;
      console.log(validatedBody.otp, validatedBody.otpExpireTime);
      if (userResult.email === email) {
        await commonFunction.sendOtp(email, otp);
      }
      const updateResult = await updateUser(
        { email: email },
        { $set: { otp: validatedBody.otp, otpExpireTime: validatedBody.otpExpireTime } }

      );
      console.log(updateResult)
      return res.json(new response(updateResult, responseMessage.OTP_SEND));

    } catch (error) {
      return next(error);
    }
  },

  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••


  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••
  forgetPassword: async (req, res, next) => {
    const validationSchema = Joi.object({
      email: Joi.string().required(),
      otp: Joi.string().required(),
      newPassword: Joi.string().required(),
      confirmNewPassword: Joi.string().required(),
    });

    try {
      const validatedBody = await validationSchema.validateAsync(req.body);
      const { email, otp, newPassword, confirmNewPassword } = validatedBody;

      const userForgot = await findUser3({ email: email, userType: userType.VENDOR });

      if (!userForgot) {
        throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND);
      }

      if (userForgot.otp === otp && userForgot.otpExpireTime >= Date.now()) {
        if (newPassword !== confirmNewPassword) {
          throw apiError.conflict(responseMessage.PASSWORD_NOT_MATCH);
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        userForgot.password = hashedPassword;

        await updateUser(
          { email: userForgot.email },
          {
            $set: { password: hashedPassword },
            $unset: { otp: 1, otpExpireTime: 1 },
          }
        );

        return res.json(new response(null, responseMessage.PASSWORD_RESET_SUCCESS));
      } else {
        throw apiError.badRequest(responseMessage.INCORRECT_OTP);
      }
    } catch (error) {
      return next(error);
    }
  },

  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••


  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••
  resetPassword: async (req, res, next) => {
    const validationSchema = Joi.object({
      // email:Joi.string().required(),
      password: Joi.string().required(),
      newPassword: Joi.string().required(),
      confirmNewPassword: Joi.string().required()
    });
    try {
      const validatedBody = await validationSchema.validateAsync(req.body);
      const { password, newPassword, confirmNewPassword } = validatedBody;
      const userData = await findUser3({ _id: req.userId });
      if (!userData) {
        throw apiError.badRequest(responseMessage.VENDOR_NOT_FOUND);
      }
      const isMatch = bcrypt.compareSync(password, userData.password);
      if (isMatch) {
        if (newPassword === confirmNewPassword) {
          const change = bcrypt.hashSync(newPassword, 10);
          await updateUser({ email: userData.email }, { $set: { password: change } });
          return res.json(new response("Your password has been reset ."));

        }
        throw apiError.conflict(responseMessage.PASSWORD_NOT_MATCH)
      } else {
        throw apiError.badRequest(responseMessage.INVALID_OLD_PASSWORD)
      }
    } catch (error) {
      return next(error);
    }
  },

  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••


  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••
  getUserData: async (req, res, next) => {
    try {
      const userResult = await findUser1({ _id: req.userId, userType: { $in: [userType.USER] } }, {
        _id: 0, password: 0, status: 0, UserType: 0,
        otpExpireTime: 0, otpVerified: 0, createdAt: 0, updatedAt: 0
      })
      if (!userResult) {
        throw apiError.notFound(responseMessage.VENDOR_NOT_FOUND);
      }
      return res.json(new response(userResult, responseMessage.VENDOR_DETAILS));
    } catch (error) {
      console.log(error)
      return next(error);
    }
  },

  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••



  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••
  vendorUpdate: async (req, res, next) => {
    const validationSchema = Joi.object({
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().optional(),
      countryCode: Joi.string().optional(),

      mobileNumber: Joi.string().optional(),
      dateOfBirth: Joi.string().optional(),
      password: Joi.string().optional(),
    });

    try {
      const validatedBody = await validationSchema.validateAsync(req.body)
      const { email, password, mobileNumber } = validatedBody
      const userExist = await findUser7({ _id: req.userId })
      if (!userExist) {
        throw apiError.badRequest(responseMessage.VENDOR_NOT_FOUND)
      } else {
        if (password) {
          let confirmPassword = req.body.confirmPassword;
          if (!confirmPassword) {
            throw apiError.badRequest({ responseMessage: "Confirm password is required." });
          } else if (confirmPassword != password) {
            throw apiError.badRequest(responseMessage.CONFIRM_PASSWORD_NOT_MATCHED);
          } else {
            const hassPass = bcrypt.hashSync(password, 10);
            await findUser4(
              { _id: userExist._id },
              { $set: { password: hassPass } }
            );
            return res.json(
              new response(responseMessage.PASSWORD_CHANGED)
            );
          }
        }
        if (email && mobileNumber) {
          const change = await checkUserExists(mobileNumber, email);
          if (change) {
            if (change.email === email) {
              throw apiError.badRequest(responseMessage.EMAIL_ALREADY_EXIST)
            } else if (change.mobileNumber === mobileNumber) {
              throw apiError.badRequest(responseMessage.MOBILE_ALREADY_EXIST)
            } else {
              const result = await findUser4(
                { _id: userExist._id },
                { $set: { email: email, mobileNumber: mobileNumber } }
              );
              return res.json(
                new response(result, responseMessage.SUCCESS)
              );
            }
          }
        } else if (!email && mobileNumber) {
          const query = {
            $and: [
              { mobileNumber: mobileNumber },
              {
                _id: { $ne: userExist._id },
              },
            ],
          };
          const result = await findUser3(query);
          if (result) {
            throw apiError.conflict(responseMessage.MOBILE_ALREADY_EXIST);
          } else {
            const result = await findUser4(
              { _id: userExist._id },
              { $set: { mobileNumber: mobileNumber } }
            );
            return res.json(
              new response(result, responseMessage.SUCCESS)
            );
          }
        } else if (email && !mobileNumber) {
          const query = {
            $and: [
              { email: email },
              {
                _id: { $ne: userExist._id },
              },
            ],
          };
          const result = await findUser3(query);
          if (result) {
            throw apiError.conflict(responseMessage.EMAIL_ALREADY_EXIST);
          } else {
            const result = await findUser4(
              { _id: userExist._id },
              { $set: { email: email } }
            );
            return res.json(
              new response(result, responseMessage.SUCCESS)
            );
          }
        } else if (!email && !mobileNumber) {
          const result = await findUser4(
            { _id: userExist._id },
            { $set: req.body }
          );
          return res.json(
            new response(result, responseMessage.SUCCESS)
          );
        }
      }

    } catch (error) {
      console.log(error);
      return next(error);
    }

  },

  // ••••••••••••••••••••••••••••••••••••••••••••••vendorlogin••••••••••••••••••••••••••••••


  // ••••••••••••••••••••••••••••••••••••••••••••••••image Upload•••••••••••••••••••••••••••••••••••••••••••••

  imageUpload: async (req, res, next) => {
    try {
      const userData = await findUser7({ _id: req.userId })
      if (!userData) {
        throw apiError.badRequest(responseMessage.VENDOR_NOT_FOUND)
      }
      const file = req.body.image;
      const urlImage = await commonFunction.getImageUrl(file)
      await findUser4(
        { email: userData.email },
        { $set: { profileImage: urlImage } }
      );
      return res.json(
        new response(responseMessage.PROFILE_UPDATED)
      );
    } catch (error) {
      return next(error)
    }
  },




}