import express from "express";
import {roleMiddleware} from "../middleware/roleMiddleware.js";
import {createGame, deleteGame, getActiveGame} from "../controlers/gameController.js";

const router = express.Router();

router.post("/", roleMiddleware(["ADMIN", "HOST"]), createGame);
router.get("/active", roleMiddleware(["ADMIN", "HOST"]), getActiveGame);
router.delete("/:gameId", roleMiddleware(["ADMIN", "HOST"]), deleteGame);

export default router;
