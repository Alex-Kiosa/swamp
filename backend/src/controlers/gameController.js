import Game from "../models/gameModel.js";
import {v4 as uuidv4} from "uuid";
import {generateDeck} from "../services/deckService.js";
import {GAME_PROJECTION} from "../constants/gameConstants.js";
import User from "../models/userModel.js";
import {generateSocketToken} from "../services/generateSocketToken.js";

export async function createGame(req, res) {
    try {
        const hostId = req.user.id
        const gameId = uuidv4().slice(0, 8)
        const existingGame = await Game.findOne({hostId: hostId, isActive: true})

        if (existingGame) {
            return res.status(403).json({message: "Each user can have only one active game"})
        }

        // Генерируем колоды
        const plantsDeck = await generateDeck("plants")
        const animalsDeck = await generateDeck("animals")
        const creaturesDeck = await generateDeck("creatures")
        const wisdomDeck = await generateDeck("wisdom")
        const macDeck = await generateDeck("mac")
        const swampDeck = await generateDeck("swamp")

        const user = await User.findOne({_id: req.user.id})

        const game = new Game({
            hostId: hostId,
            gameId: gameId,
            players: [
                {
                    playerId: hostId,
                    name: user.name,
                    role: "HOST",
                    socketId: null,
                    isOnline: false
                }
            ],
            decks: {
                plants: plantsDeck,
                animals: animalsDeck,
                creatures: creaturesDeck,
                wisdom: wisdomDeck,
                mac: macDeck,
                swamp: swampDeck,
            },
            discardPiles: {
                plants: [],
                animals: [],
                creatures: [],
                wisdom: []
            }
        })

        await game.save()

        const socketToken = generateSocketToken(gameId, hostId)

        res.status(201).json({
            game,
            socketToken
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
        if (game.players.length >= game.limitPlayers) {
            return res.status(403).json({message: "Превышен лимит подключений. Максимум - 15"})
        }

        const playerId = uuidv4()

        game.players.push({
            playerId,
            name,
            role: "PLAYER",
            "socketId": null,
            isOnline: false,
        })

        await game.save()

        const socketToken = generateSocketToken(gameId, playerId)

        res.status(201).json({
            socketToken,
            gameId,
            playerId
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to join game as guest"})
    }
}

export async function getGamePublic(req, res) {
    // console.log("getting game public")
    try {
        const gameId = req.params.gameId

        // Find game and return only necessary fields using the Mongo projection
        const game = await Game.findOne(
            {gameId, isActive: true},
            {hostId: 1, gameId: 1, players: 1, limitPlayers: 1, isActive: 1, _id: 0}
        )

        if (!game) {
            return res.status(404).json({message: "Game not found"})
        }

        let isHost = false

        if (req.user) {
            isHost = req.user.id === String(game.hostId)
        }

        //Преобразуем Mongoose документ в обычный JS объект
        const gameObj = game.toObject()
        gameObj.isHost = isHost

        return res.status(200).json(gameObj)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to get game"})
    }
}

export async function getActiveGameByHost(req, res) {
    try {
        const hostId = req.user.id

        // Find game and return only necessary fields using the Mongo projection
        const game = await Game.findOne(
            {hostId, isActive: true},
            GAME_PROJECTION
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