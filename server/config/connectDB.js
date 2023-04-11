import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async (/*DATABASE_URL*/ req, res) => {
    try {
        const DB_OPTIONS = {
            dbName: "SCSdatabase"
        }

        console.log("Server: ", process.env.DATABASE_URL) // only for development, remove it in production afterwards

        //await mongoose.connect(/*DATABASE_URL, DATA_OPTIONS*/process.env.DATABASE_URL, DB_OPTIONS)
        //Console.log('Connected Successfully!') // only for development, remove it in production afterwards
        //res.send({"status":"connected", "message":"connection successfully"})*/

        await mongoose.connect(process.env.DATABASE_URL, DB_OPTIONS).then(() => {
            console.log('Connected Successfully!') // only for development, remove it in production afterwards

            //res.send({"status":"connected", "message":"connection successfully"})

        })
    }
    catch (error) {
        console.log(error) // only for development, remove it in production afterwards

        //res.send({"status":"failed", "message":"connection failed"})
    }
}

export default connectDB