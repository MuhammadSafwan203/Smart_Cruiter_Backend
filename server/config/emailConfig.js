import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

// for sending password verification token through email

let transporter = nodemailer.createTransport({
    host: process.env.Email_Host,
    port: process.env.Email_Port,
    secure: false,                                  // true for 465, false for other ports
    auth: {
        user: process.env.Email_User,               // Admin's gmail account
        pass: process.env.Email_Pass,           // Admin's account passwprd
    }
})

export default transporter