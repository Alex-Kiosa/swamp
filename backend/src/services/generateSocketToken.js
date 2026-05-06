import jwt from "jsonwebtoken";
import Game from "../models/gameModel.js";

export function generateSocketToken(gameId, playerId) {
    const secretKey = process.env.JWT_SECRET

    if (!secretKey) {
        throw new Error("JWT_SECRET is not defined")
    }

    if (!gameId || !playerId) {
        throw new Error("Invalid payload for socket token")
    }

    const socketToken = jwt.sign(
        {
            gameId,
            playerId
        },
        secretKey,
        {expiresIn: "72h"}
    )

    return socketToken
}

export async function generateSocketTokenHost(req, res) {
    try {
        const { gameId } = req.params
        const userId = req.user.id

        const game = await Game.findOne({ gameId, isActive: true })

        if (!game) {
            return res.status(404).json({ message: "Game not found" })
        }

        if (String(game.hostId) !== userId) {
            return res.status(403).json({ message: "Access denied" })
        }

        const socketToken = generateSocketToken(gameId, userId)

        return res.json({ socketToken })
    } catch (error) {
        console.error("generateSocketTokenHost error:", error)

        return res.status(500).json({
            message: "Error generateSocketTokenHost",
            error: error.message
        })
    }
}