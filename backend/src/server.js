import "dotenv/config"
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import regRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import chipRoutes from "./routes/chipRoutes.js";
import {connectDB} from "./db.js";
import cors from "./middleware/corsMiddleware.js";
import {socketAuthMiddleware} from "./sockets/socketAuth.js";
import {index} from "./sockets/index.js";
import path from "path";
import {createTransporter, sendRegEmail} from "./services/mailService.js"


// Create backend
const app = express()
const server = http.createServer(app);

// Socket
export const io = new Server(server, {
    cors: {
        // TODO: в проде указать домен фронта
        origin: `${process.env.URI}:${process.env.PORT_FRONT}`,
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
})

socketAuthMiddleware(io)

// регистрация всех сокет-хендлеров
index(io)

const PORT = process.env.PORT

// Middlewares
app.use(cors)
app.use(express.json())

// Routes
app.use("/api/auth", regRoutes)
app.use("/api/games", gameRoutes)
app.use("/api/", chipRoutes)
app.get("/api/test-email", async (req, res) => {
    try {
        await sendRegEmail("akiosa88@gmail.com", "Alex", "test")

        console.log("test email was sent successfully!")
        res.json({ message: "Email sent" })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "error sending test email"})
    }
})
// TODO: add report in data base, add record email's logging in report https://chatgpt.com/share/69f0e2b9-b9a0-832a-8ca1-41f4628caec3

// Статика
app.use("/uploads", express.static(path.join(process.cwd(), "..", "uploads")))

// Start the server only after DB connection
async function start() {
    try {
        await connectDB()

        // Check SMTP
        const transporter = createTransporter()
        await transporter.verify()
        console.log("📧 SMTP ready")

        server.listen(PORT, () => {
            console.log("🚀 Server started on PORT:", PORT)
        })

    } catch (error) {
        console.error("❌ Failed to start server:", error)
    }
}

start()