import userModel from '../../models/Users.js';
import bCrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import transporter from '../../config/emailConfig.js';
import Express from "express";


 // Password Forget
class forgetPassword {
   
    // 1. sending email on mail account
    static sendUserPassResetEmail = async(req, res) => {

        const {email_address} = req.body

        if(email_address) {

            const user = await userModel.findOne({email_address: email_address})

            if(user) {

                const secretKey = user._id + process.env.JWT_Secret_Key
                const token = jwt.sign({userID: user._id}, secretKey, {expiresIn: '15m'}) // '_id' because database var is also '_id' 
                
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

                res.send({"status": "success", "message": "Email sent... please check your mail account", "info":info})
            }
            else {

                console.log("Email does not exists") // only for development, remove it in production afterwards

                res.send({"status": "failed", "message": "Email does not exists"})
            }
        }
        else {

            console.log("Email is required") // only for development, remove it in production afterwards

            res.send({"status": "failed", "message": "Email is required"})
        }
    }

    // 2. verifying email on mail account and setting new password
    static userPassReset = async(req, res) => {

        const {password, confirm_password} = req.body
        const {id, token} = req.params
        const user = await userModel.findById(id)

        // verifying secretKey or token
        const newSecretKey = user._id + process.env.JWT_Secret_Key

        try {
        
            jwt.verify(token, newSecretKey)

            if(password && confirm_password) {

                if (password ===  confirm_password) {

                    const salt = await bCrypt.genSalt(15)
                    const newHashPassword = await bCrypt.hash(password, salt)  

                    await userModel.findByIdAndUpdate(user._id, {$set: {password:newHashPassword}})

                    console.log("Password reset successfully") // only for development, remove it in production afterwards

                    res.send({"status": "failed", "message": "Password reset successfully"})
                }
                else {

                    console.log("Password does not match") // only for development, remove it in production afterwards

                    res.send({"status": "failed", "message": "Password does not match"})
                }
            }
            else {

                console.log("All fields are required") // only for development, remove it in production afterwards

                res.send({"status": "failed", "message": "All fields are required"})
            }

        } catch (error) {
            
            console.log(error) // only for development, remove it in production afterwards

            res.send({"status": "failed", "message": "Invalid token"})
        }
    }
}

export default forgetPassword