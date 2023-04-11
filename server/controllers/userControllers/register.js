import userModel from '../../models/Users.js';
import bCrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import transporter from '../../config/emailConfig.js';
import Express from "express";

// Registration
const register = async (req, res, next) => {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // _>>>>>>>CONTROLLER IS WORKING NOW REFINE YOUR CODE
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const { first_name, last_name, email_address, company_name, password, confirm_password,
        termCondition } = req.body

    const user = await userModel.findOne({ email_address: email_address })

    if (user) {

        res.send({ "status": "failed", "message": "email already exists" })
    }
    else {

        if (name && username && email_address && company_name && password && confirm_password &&
            termCondition) {

            if (password === confirm_password) {

                try {

                    const salt = await bCrypt.genSalt(15)
                    const hashPassword = await bCrypt.hash(password, salt)

                    const newUser = new userModel({
                        name: name,
                        username: username,
                        email_address: email_address,
                        company_name: company_name,
                        password: hashPassword,
                        //confirm_password:confirm_password,
                        termCondition: termCondition
                    })

                    await newUser.save()

                    const savedUser = await userModel.findOne({ email_address: email_address })

                    // Generate JWT token
                    const token = jwt.sign({ userID: savedUser._id }, process.env.JWT_Secret_Key,
                        { expiresIn: '5d' }) // '_id' because database var is also '_id' 

                    res.status(201).send({
                        "status": "success", "message": "registration successful",
                        "token": token
                    })

                } catch (error) {

                    //console.log(error) // only for development, remove it in production afterwards

                    res.send({ "status": "failed", "message": "Registration failed" })
                }
            }
            else {

                //console.log("Password does not match") // only for development, remove it in production afterwards

                res.send({ "status": "failed", "message": "Password does not match" })
            }
        }
        else {

            //console.log("All fields are required") // only for development, remove it in production afterwards

            res.send({ "status": "failed", "message": "All fields are required" })
        }
    }
}


export default register;