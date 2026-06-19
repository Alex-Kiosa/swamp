import express from "express";
import { optionalAuthMiddleware } from "../middleware/optionalAuthMiddleware.js";
import { getVideoToken } from "../controlers/videoController.js";

const router = express.Router();

// Эндпоинт для получения токена видеочата
// Используем optionalAuthMiddleware, чтобы пускать и авторизованных юзеров, и гостей (игроков по ссылке)
router.get("/token", optionalAuthMiddleware, getVideoToken);

export default router;