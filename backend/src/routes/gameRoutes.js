import express from "express";
import {roleMiddleware} from "../middleware/roleMiddleware.js";
import {
    createGame,
    deleteGame,
    getActiveGameByHost,
    getGamePublic,
    joinGameAsPlayer
} from "../controlers/gameController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {optionalAuthMiddleware} from "../middleware/optionalAuthMiddleware.js";
import {socketAuthMiddleware} from "../sockets/socketAuth.js";

const router = express.Router();

// private
router.post("/", roleMiddleware(["ADMIN", "USER", "DEMO_USER"]), createGame)
router.get("/active", authMiddleware, getActiveGameByHost)
router.delete("/:gameId", authMiddleware, deleteGame)

// PUBLIC
router.post("/:gameId/join", joinGameAsPlayer)
// TODO: переделать flow для генерации сокет токена в правильной архитектуре. Сейчас есть баг. Если создать игру в одном браузере, а потом зайти в аккаунт ведущего в другом, то сокет токена не будет
// router.post("/:gameId/socket-token", generateSocketTokenGame)
router.get("/:gameId", optionalAuthMiddleware, getGamePublic)

export default router;