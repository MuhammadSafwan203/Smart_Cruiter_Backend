import userModel from '../../models/Users.js';
import bCrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import transporter from '../../config/emailConfig.js';
import Express from "express";

// Login
const login = async (req, res, next) => {

    try {
        const {email_address, password} = req.body

        if(email_address && password) {

            const user = await userModel.findOne ({email_address:email_address})

            if(user != null) {
                    
                const matchEnteredPassWithDBPass = await bCrypt.compare(password, user.password)

                if((user.email_address === email_address) && matchEnteredPassWithDBPass) {

                    // Generate JWT token
                    const token = jwt.sign({userID: user._id}, process.env.JWT_Secret_Key, 
                        {expiresIn: '5d'}) // '_id' because database var is also '_id'

                    //console.log("Login Successful") // only for development, remove it in production afterwards

                res.send({"status":"success", "message":"Login Successful", "token":token})
                }
                else {
                    //console.log("Invalid email or password") // only for development, remove it in production afterwards

                res.send({"status":"failed", "message":"Invalid email or password"})
                    }
            }
            else {
                //console.log("You are not registered") // only for development, remove it in production afterwards

                res.send({"status":"failed", "message":"You are not registered"})
            }
        }
        else { 
            //console.log("All fields are required") // only for development, remove it in production afterwards

            res.send({"status":"failed", "message":"All fields are required"})
        }
        
    } catch (error) {
        //console.log(error) // only for development, remove it in production afterwards
            res.send({"status":"failed", "message":"Login failed"})
    }
}

export default login