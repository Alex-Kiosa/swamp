import "dotenv/config"
import express from 'express'
import http from 'http'
import {Server} from 'socket.io';
import regRoutes from "./routes/authRoutes.js"
import gameRoutes from "./routes/gameRoutes.js"
import chipRoutes from "./routes/chipRoutes.js"
import {connectDB} from "./db.js"
import cors from "./middleware/corsMiddleware.js"
import {registerSocketAuthMiddleware} from "./sockets/registerSocketAuthMiddleware.js"
import {socketIndex} from "./sockets/socketIndex.js"
import path from "path"
import {createTransporter, sendMail} from "./services/mailService.js"
import { startEmailWorker } from "./workers/emailWorker.js"


// Create server
const app = express()
const server = http.createServer(app)

// Socket
export const io = new Server(server, {
    cors: {
        // TODO: в проде указать домен фронта
        origin: `${process.env.URI}:${process.env.PORT_FRONT}`,
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
})

// 1. AUTH MIDDLEWARE (gating layer)
// проверяет токен ДО connection
// middleware НЕ вызывается прямо сейчас
// регистрируем его внутри io
// middleware вызывается позже, когда клиент подключается: io.on("connection", (socket) => { ... })
registerSocketAuthMiddleware(io)
// 2. SOCKET LOGIC LAYER
// * все connection + handlers
socketIndex(io)

// HTTP (port, middlewares, routes etc)
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
        await sendMail("akiosa88@gmail.com", "Alex", "test")
        res.json({ message: "Email sent" })
    } catch (error) {
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

        // Start workers
        startEmailWorker()

        server.listen(PORT, () => {
            console.log("🚀 Server started on PORT:", PORT)
        })

    } catch (error) {
        console.error("❌ Failed to start server:", error)
    }
}

start()