import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import {Server} from 'socket.io';
import regRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import chipRoutes from "./routes/chipRoutes.js";
import {connectDB} from "./db.js";
import cors from "./middleware/corsMiddleware.js";

dotenv.config()

// Create backend
const app = express()
const server = http.createServer(app);
const io = new  Server(server, {
    cors: {
        origin: `http://localhost:${process.env.PORT}`,
        methods: ["GET", "POST"],
    }
})
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors)
app.use(express.json())


// Routes
app.use('/api/auth', regRoutes)
app.use('/api/games', gameRoutes)
app.use("/api/", chipRoutes);

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
