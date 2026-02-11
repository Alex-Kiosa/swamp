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

router.post("/", roleMiddleware(["ADMIN", "USER", "DEMO_USER"]), createGame)
router.get("/active", authMiddleware, getActiveGameByHost)
router.delete("/:gameId", authMiddleware, deleteGame)

// PUBLIC
router.post("/:gameId/join", joinGameAsPlayer)
router.get("/:gameId", optionalAuthMiddleware, getGamePublic)

export default router;