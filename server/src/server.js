import  express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";

dotenv.config()
const MONGO_URL = process.env.MONGO_URL

// Create server
const app = express();

// Routes
app.use('/api/', authRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})