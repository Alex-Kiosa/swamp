import express from 'express';
import dotenv from 'dotenv';
import regRoutes from "./routes/authRoutes.js";
import {connectDB} from "./db.js";
import cors from "./middleware/corsMiddleware.js";

dotenv.config()

// Create backend
const app = express();
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors)
// Use express.json() middleware which parses successive requests with key data in JSON format, making it available in the req.body object
app.use(express.json())

// Routes
app.use('/api/auth', regRoutes)

// Start the server only after DB connection
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("🚀 Server started on PORT:", PORT)
        })
    })
    .catch((error) => {
        console.error("❌ Failed to start server:", error)
    })
