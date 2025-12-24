import express from "express";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import {createChip, getChips, moveChip} from "../controlers/chipController.js";

const router = express.Router();

router.post("/create", roleMiddleware(["ADMIN", "HOST"]), createChip);
router.get("/:roomId", getChips);
router.patch("/:chipId/move", moveChip);

export default router;
