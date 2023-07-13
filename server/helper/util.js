import config from "config";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import qrcode from "qrcode";
import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: "dgh816ovb",
    api_key: "463754974654115",
    api_secret: "F-8PXm-Ko4yYchtWZtuBijLtd5Y",
  });
  
module.exports = {

    sendOtp : async (email,subject, html) =>{
        try {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: config.get('nodemailer.email'),
                    pass: config.get('nodemailer.password')
                }
            });
            const mailOption = {
                from: '9517102112a@gmail.com',
                to: email,
                subject: subject,
                text: html,
            }
    
            const info = await transporter.sendMail(mailOption)
            console.log("email has been sent", info.response)
        } catch (error) {
            console.log(error);
            throw new Error('Error is made for sending mail')
        }
    },
    getOTP() {
        
    const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const otpExpiration = Date.now() + 3 * 60 * 1000;
    return {otp: otp.toString(), otpExpiration};
      },

     
      getImageUrl: async (files) => {
        try {
          const data = await cloudinary.v2.uploader.upload(files);
          return data.secure_url;
        } catch (error) {
          return error;
        }
      },
      

}