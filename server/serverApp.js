import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import connectDB from './config/connectDB.js'
import userRoutes from './routes/userRoutes.js'
import mongoose from 'mongoose';

const app = express()
const port = process.env.port
//const DATABASE_URL = process.env.DATABASE_URL

// CORS Policy
app.use(cors())

// Database Connection
//connectDB(DATABASE_URL)
mongoose.set('strictQuery', false);
connectDB()

// JSON
app.use(express.json())

// Load Routes
app.use("/api/user", userRoutes)

app.listen(port, () => {

  // For Server listening at mongodb://127.0.0.1:27017/SCSdatabase:
  //console.log(`Server listening at ${process.env.DATABASE_URL}`)

  console.log(`Server listening at http://localhost:${port}`) // only for development, remove it in production afterwards

  //res.send({"status":"listening", "message": `Server listening at http://localhost:${port}`})
})