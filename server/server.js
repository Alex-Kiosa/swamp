import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';

// Загрузить переменные окружения, которые затем будут храниться в объекте process.env
dotenv.config()
const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

// Создаём сервер
const app = express();

mongoose
    .connect(MONGO_URL)
    .then((res) => {
        console.log('✅ MongoDB connected')
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error: ', error.message)
        process.exitCode(1)
    })

// Middleware
app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);