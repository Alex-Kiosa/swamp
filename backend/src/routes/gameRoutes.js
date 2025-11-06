import express from "express";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createGame } from "../controlers/gameController.js";

const router = express.Router();

router.post("/create", roleMiddleware(["ADMIN", "HOST"]), createGame);

export default router;
