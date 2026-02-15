import {generateSocketToken} from "./gameController.js";

export async function generateSocketTokenGame(req, res) {
    try {
        const { gameId } = req.params
        const userId = req.user.id

        const game = await Game.findOne({ gameId, isActive: true })
        if (!game) {
            return res.status(404).json({ message: "Game not found" })
        }

        let role = null

        if (String(game.hostId) === userId) {
            role = "HOST"
        } else {
            const player = game.players.find(p => p.playerId === userId)
            if (player) {
                role = "PLAYER"
            }
        }

        if (!role) {
            return res.status(403).json({ message: "Access denied" })
        }

        const socketToken = generateSocketToken(gameId, userId, role)

        return res.status(200).json({ socketToken })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to generate socket token" })
    }
}
