import express from "express";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {createChip, deleteChip, deleteChipsByGame, getChips, moveChip} from "../controlers/chipController.js";

const router = express.Router();

router.post("/games/:gameId/chips", roleMiddleware(["ADMIN", "HOST"]), createChip);
router.get("/games/:gameId/chips", getChips);
router.delete("/games/:gameId/chips", roleMiddleware(["ADMIN", "HOST"]), deleteChipsByGame);

router.patch("/chips/:chipId", moveChip);
router.delete("/chips/:chipId", roleMiddleware(["ADMIN", "HOST"]), deleteChip);

export default router;
