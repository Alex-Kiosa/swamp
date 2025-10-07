import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import {connectDB} from "./db.js";
import {matchedData, query, check, validationResult} from "express-validator";

dotenv.config()

// Create server
const app = express();
const PORT = process.env.PORT || 5000

// Connect to DB
connectDB()

// Use express.json() middleware which parses successive requests with key data in JSON format, making it available in the req.body object
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})