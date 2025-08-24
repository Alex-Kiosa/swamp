import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import {connectDB} from "./db.js";

dotenv.config()

// Create server
const app = express();
const PORT = process.env.PORT || 5000

// Connect to DB
connectDB()

// Routes
app.use('/api/', authRoutes)

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
})