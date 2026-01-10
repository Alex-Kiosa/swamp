import Game from "../models/gameModel.js";
import {v4 as uuidv4} from "uuid";

export async function createGame(req, res) {
    try {
        const hostId = req.user.id
        const gameId = uuidv4().slice(0, 8)
        const existingGame = await Game.findOne({hostId, isActive: true})

        if (existingGame) {
            return res.status(403).json({message: "Each user can have only one active game"})
        }

        const game = new Game({
            hostId,
            gameId: gameId,
            players: [],

        })

        await game.save()

        res.status(201).json({
            message: "Game created",
            gameId: game.gameId,
            link: `http://localhost:${process.env.PORT}/game/${game.gameId}`
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

        return res.status(200).json({gameId: game.gameId})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get active game"})
    }
}

export async function deleteGame(req, res) {
    try {
        const gameId = req.params.gameId
        const hostId = req.user.id

        const game = await Game.findOneAndDelete({
            gameId,
            hostId,
            isActive: true
        })
        if (!game) {
            return res.status(404).json({message: "Game not found or access denied"})
        }

        return res.status(200).json({message: `🗑️ Game ${gameId} deleted`})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to delete game"})
    }
}