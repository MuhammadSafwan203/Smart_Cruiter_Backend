import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({
    name: {type:String, required: true, trim:true},
    username: {type:String, required: true, trim:true},
    email_address: {type:String, required: true, trim:true},
    company_name: {type:String, required: true, trim:true},
    password: {type:String, required: true, trim:true},
    //confirm_password: {type:String, required: true, trim:true},
    termCondition: {type:Boolean, required: true}
})

// Model for above Schema
const userModel = mongoose.model("user", userSchema)

export default userModel