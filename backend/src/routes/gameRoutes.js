import express from "express";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {createGame, getActiveGame} from "../controlers/gameController.js";

const router = express.Router();

router.get("/active", roleMiddleware(["ADMIN", "HOST"]), getActiveGame);

router.post("/create", roleMiddleware(["ADMIN", "HOST"]), createGame);

export default router;
