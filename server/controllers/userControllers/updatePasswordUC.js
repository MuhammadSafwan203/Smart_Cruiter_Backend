import userModel from '../../models/Users.js';
import bCrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import transporter from '../../config/emailConfig.js';
import Express from "express";

// Password Update
const updatePassword = async(req, res, next) => {

    const {password, confirm_password} = req.body

    if(password, confirm_password) {

        if(password === confirm_password) {

            const salt = await bCrypt.genSalt(15)
            const newHashPassword = await bCrypt.hash(password, salt)
                
            //console.log(req.user) // only for development, remove it in production afterwards
            await userModel.findByIdAndUpdate(req.user._id, {$set: {password:newHashPassword}})

            res.status(401).send({"status": "success", "message": "Password changed successfully"})
        }
        else {
            //console.log("Password does not match") // only for development, remove it in production afterwards

            res.send({"status":"failed", "message":"Password does not match"})
        }
    }
    else {
        //console.log("All fields are required") // only for development, remove it in production afterwards

        res.send({"status":"failed", "message":"All fields are required"})
    }
}

export default updatePassword