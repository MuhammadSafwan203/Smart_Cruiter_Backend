import userModel from '../../models/Users.js';
import bCrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import transporter from '../../config/emailConfig.js';
import Express from "express";

// See Profile
const profileDetailOfLoggedUser = async(req, res) => {
        res.send({"user": req.user})
    }

export default profileDetailOfLoggedUser