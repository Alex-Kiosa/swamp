import Game from "../models/gameModel.js";
import {v4 as uuidv4} from "uuid";

export async function createGame(req, res) {
    try {
        const hostId = req.user.id
        const roomId = uuidv4().slice(0, 6)
        const existingGame = await Game.findOne({hostId, isActive: true})

        if (existingGame) {
            return res.status(403).json({message: "Each user can have only one active game"})
        }

        const game = new Game({
            hostId,
            roomId,
            players: [],
            chips: req.chips,
        })

        await game.save()

        res.status(201).json({
            message: "Game created",
            roomId: game.roomId,
            link: `http://localhost:${process.env.PORT}/game/${game.roomId}`
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to create game"})
    }
}

export async function getActiveGame(req, res) {
    try {
        const hostId = req.user.id

        const game = await Game.findOne({hostId, isActive: true})

        if (!game) {
            return res.status(404).json({message: "Active game not found"})
        }

        return res.status(200).json({roomId: game.roomId})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get active game"})
    }
}

export async function deleteGame(roomId) {
    try {
        const game = await Game.findOne({roomId})
        if (!game) return

        game.isActive = false
        await game.save()

        await Game.deletOne({roomId})
        console.log(`🗑️ Game ${roomId} deleted`);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to delete game"})
    }
}