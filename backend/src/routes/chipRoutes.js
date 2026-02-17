import express from "express"
import {roleMiddleware} from "../middleware/roleMiddleware.js"
import {createChip, deleteChip, deleteChipsByGame, getChips, moveChip} from "../controlers/chipController.js"

const router = express.Router()

router.post("/games/:gameId/chips", roleMiddleware(["ADMIN", "USER", "DEMO_USER"]), createChip)
// TODO: добавить защиту endpoint при получении игры
router.get("/games/:gameId/chips", getChips)
router.delete("/games/:gameId/chips", roleMiddleware(["ADMIN", "USER", "DEMO_USER"]), deleteChipsByGame)

// TODO: добавить защиту endpoint при движении фишек
router.patch("/chips/:chipId", moveChip)
router.delete("/chips/:chipId", roleMiddleware(["ADMIN", "USER", "DEMO_USER"]), deleteChip)

export default router;
