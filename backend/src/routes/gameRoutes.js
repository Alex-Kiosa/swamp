import express from "express";
import {roleMiddleware} from "../middleware/roleMiddleware.js";
import {
    createGame,
    deleteGame,
    getActiveGameByHost,
    getGamePublic, getSocketToken,
    joinGameAsPlayer
} from "../controlers/gameController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {optionalAuthMiddleware} from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

// PRIVATE
router.post("/", roleMiddleware(["ADMIN", "USER", "DEMO_USER"]), createGame)
router.get("/active", authMiddleware, getActiveGameByHost)
router.delete("/:gameId", authMiddleware, deleteGame)
// old endpoint for generate socket token for host
// router.get("/:gameId/socket-token", authMiddleware, generateSocketTokenHost)

// PUBLIC
router.post("/:gameId/join", joinGameAsPlayer)
router.get("/:gameId", optionalAuthMiddleware, getGamePublic)

// REALTIME ACCESS (critical)
router.get("/:gameId/socket-token", optionalAuthMiddleware, getSocketToken)

export default router;