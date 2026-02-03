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

// Socket
export const io = new Server(server, {
    cors: {
        // в проде указать домен фронта
        origin: `${process.env.URI}:${process.env.PORT_FRONT}`,
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
})

//Клиент при подключении сообщает gameId → попадает в комнату
//Сервер ретранслирует события изменения всем в комнате
io.on('connection', (socket) => {
    console.log('🟢 Client connected')

    socket.on("join-room", (gameId) => {
        socket.join(gameId)
        console.log(`👥 ${socket.id} joined room ${gameId}`)
    })
    //
    // // события фишки
    // socket.on("chip:move", ({ chipId, position, gameId }) => {
    //     io.to(gameId).emit("chip:moved", { chipId, position })
    // })
    //
    socket.on('disconnect', () => {
        console.log('🔴 Client disconnected ', socket.id)
    })
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
        server.listen(PORT, () => {
            console.log("🚀 Server started on PORT:", PORT)
        })
    })
    .catch((error) => {
        console.error("❌ Failed to start server:", error)
    })