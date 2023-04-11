/*import userModel from '../models/Users.js'
import bCrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import transporter from '../config/emailConfig.js'


class userController {
    // Login
    static userLogin = async (req, res) => {
        try {
            const { email_address, password } = req.body

            if (email_address && password) {

                const user = await userModel.findOne({ email_address: email_address })

                if (user != null) {
                    const matchEnteredPassWithDBPass = await bCrypt.compare(password, user.password)

                    if ((user.email_address === email_address) && matchEnteredPassWithDBPass) {

                        // Generate JWT token
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_Secret_Key,
                            { expiresIn: '5d' }) // '_id' because database var is also '_id'

                        //console.log("Login Successful") // only for development, remove it in production afterwards

                        res.send({ "status": "success", "message": "Login Successful", "token": token })
                    }
                    else {
                        //console.log("Invalid email or password") // only for development, remove it in production afterwards

                        res.send({ "status": "failed", "message": "Invalid email or password" })
                    }
                }
                else {
                    //console.log("You are not registered") // only for development, remove it in production afterwards

                    res.send({ "status": "failed", "message": "You are not registered" })
                }
            }
            else {
                //console.log("All fields are required") // only for development, remove it in production afterwards

                res.send({ "status": "failed", "message": "All fields are required" })
            }

        } catch (error) {
            //console.log(error) // only for development, remove it in production afterwards

            res.send({ "status": "failed", "message": "Login failed" })
        }
    }


    // See Profile
    static profileDetailOfLoggedUser = async (req, res) => {
        res.send({ "user": req.user })
    }


    // Password Update
    static updateUserPass = async (req, res) => {

        const { password, confirm_password } = req.body

        if (password, confirm_password) {

            if (password === confirm_password) {
                const salt = await bCrypt.genSalt(15)
                const newHashPassword = await bCrypt.hash(password, salt)

                //console.log(req.user) // only for development, remove it in production afterwards
                await userModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })

                res.status(401).send({ "status": "success", "message": "Password changed successfully" })
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


    // Password Forget

    // 1. sending email on mail account
    static sendUserPassResetEmail = async (req, res) => {

        const { email_address } = req.body

        if (email_address) {

            const user = await userModel.findOne({ email_address: email_address })

            if (user) {
                const secretKey = user._id + process.env.JWT_Secret_Key
                const token = jwt.sign({ userID: user._id }, secretKey, { expiresIn: '15m' }) // '_id' because database var is also '_id' 

                // link for front end, so port = 3000
                const linkForFrontEnd = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`

                //console.log(linkForFrontEnd) // only for development, remove it in production afterwards

                // using nodemailer to send token through email
                let info = await transporter.sendMail({
                    from: process.env.Email_From,
                    to: user.email_address,
                    subject: "Smart Cruiter - Account password reset link",
                    html: `<a href=${linkForFrontEnd}>Click here</a> to reset your account password`
                })

                console.log("Email sent... please check your mail account")
                // only for development, remove it in production afterwards

                res.send({ "status": "success", "message": "Email sent... please check your mail account", "info": info })
            }
            else {
                console.log("Email does not exists") // only for development, remove it in production afterwards

                res.send({ "status": "failed", "message": "Email does not exists" })
            }
        }
        else {

            console.log("Email is required") // only for development, remove it in production afterwards

            res.send({ "status": "failed", "message": "Email is required" })
        }
    }

    // 2. verifying email on mail account and setting new password
    static userPassReset = async (req, res) => {

        const { password, confirm_password } = req.body
        const { id, token } = req.params
        const user = await userModel.findById(id)

        // verifying secretKey or token
        const newSecretKey = user._id + process.env.JWT_Secret_Key

        try {
            jwt.verify(token, newSecretKey)

            if (password && confirm_password) {

                if (password === confirm_password) {

                    const salt = await bCrypt.genSalt(15)
                    const newHashPassword = await bCrypt.hash(password, salt)

                    await userModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })

                    console.log("Password reset successfully") // only for development, remove it in production afterwards

                    res.send({ "status": "failed", "message": "Password reset successfully" })
                }
                else {
                    console.log("Password does not match") // only for development, remove it in production afterwards

                    res.send({ "status": "failed", "message": "Password does not match" })
                }
            }
            else {
                console.log("All fields are required") // only for development, remove it in production afterwards

                res.send({ "status": "failed", "message": "All fields are required" })
            }

        } catch (error) {
            console.log(error) // only for development, remove it in production afterwards

            res.send({ "status": "failed", "message": "Invalid token" })
        }
    }


    // Registration
    static userRegistration = async (req, res) => {

        const { first_name, last_name, email_address, company_name, password, confirm_password,
            termCondition } = req.body

        const user = await userModel.findOne({ email_address: email_address })

        if (user) {
            return res.send({ "status": "failed", "message": "email already exists" })
        }
        else {
            if (first_name && last_name && email_address && company_name && password && confirm_password &&
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
}

export default userController*/
