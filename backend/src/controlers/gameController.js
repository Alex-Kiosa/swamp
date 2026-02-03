import Game from "../models/gameModel.js";
import {v4 as uuidv4} from "uuid";
import jwt from "jsonwebtoken";

export async function createGame(req, res) {
    try {
        const hostUserId = req.user.id
        const gameId = uuidv4().slice(0, 8)
        const existingGame = await Game.findOne({hostUserId, isActive: true})

        if (existingGame) {
            return res.status(403).json({message: "Each user can have only one active game"})
        }

        const game = new Game({
            hostUserId,
            gameId: gameId,
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

export async function joinGameAsPlayer(req, res) {
    try {
        const {gameId} = req.params
        const {name} = req.body

        const game = await Game.findOne({gameId})
        if (!game) {
            return res.status(404).json({message: "Game not found"})
        }

        const playerId = uuidv4()

        game.players.push({
            playerId,
            name,
            role: "PLAYER",
        })

        await game.save()

        const secretKey = process.env.JWT_SECRET
        const guestToken = jwt.sign(
            {
                type: "player",
                gameId,
                playerId
            },
            secretKey,
            {expiresIn: "6h"}
        )

        res.status(201).json({
            guestToken,
            gameId,
            playerId
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to join game as guest"})
    }
}

export async function getGameById(req, res) {
    try {
        const user = req.user
        if (user) {
            console.log("Авторизованный пользователь:", user.id);
        } else {
            console.log("Гость");
        }

        const gameId = req.params.gameId

        // Find game and return only necessary fields using the Mongo projection
        const game = await Game.findOne(
            {gameId, isActive: true},
            {hostUserId: 1, gameId: 1, players: 1, limitPlayers: 1, isActive: 1, _id: 0}
        )

        if (!game) {
            return res.status(404).json({message: "Game not found"})
        }

        return res.status(200).json(game)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get game"})
    }
}

export async function getActiveGameByHost(req, res) {
    try {
        const hostUserId = req.user.id

        // Find game and return only necessary fields using the Mongo projection
        const game = await Game.findOne(
            {hostUserId, isActive: true},
            {hostUserId: 1, gameId: 1, players: 1, limitPlayers: 1, isActive: 1, _id: 0}
        )

        if (!game) {
            return res.status(404).json({message: "Active game not found"})
        }

        return res.status(200).json(game)
    } catch (error) {
        console.log("getActiveGameByUser error ", error)
        res.status(500).json({message: "Failed to get active game"})
    }
}

export async function deleteGame(req, res) {
    try {
        const gameId = req.params.gameId
        const hostUserId = req.user.id

        const game = await Game.findOneAndDelete({
            gameId,
            hostUserId,
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