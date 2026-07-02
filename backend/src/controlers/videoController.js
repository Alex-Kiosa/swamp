import {AccessToken} from "livekit-server-sdk"
import Game from "../models/gameModel.js";

export const getVideoToken = async (req, res) => {
    try {
        const {gameId, participantName} = req.query

        // Проверяем, что фронтенд передал ID игры и имя участника
        if (!gameId || !participantName) {
            return res.status(400).json({
                message: "gameId and participantName are required"
            })
        }

        // Проверяем, что игра существует
        const game = await Game.findOne({gameId})

        if (!game) {
            return res.status(404).json({
                message: "Game not found"
            })
        }

        const player = game.players.find(p => p.name === participantName)

        if (!player) {
            return res.status(404).json({
                message: "Player not found"
            })
        }

        const apiKey = process.env.LIVEKIT_API_KEY
        const apiSecret = process.env.LIVEKIT_API_SECRET

        if (!apiKey || !apiSecret) {
            return res.status(500).json({
                message: "LiveKit server credentials are not configured"
            })
        }

        // Создаем токен
        const accessToken = new AccessToken(apiKey, apiSecret, {
            identity: player.playerId,
            name: participantName,
            ttl: "3h" // Время жизни токена
        })

        // Настраиваем права для видео и аудио
        accessToken.addGrant({
            roomJoin: true,
            room: gameId,      // Используем gameId как имя комнаты LiveKit
            canPublish: true,  // Может передавать камеру и микрофон
            canSubscribe: true // Может видеть и слышать других участников
        })

        // Генерируем JWT
        const token = await accessToken.toJwt()

        // Отдаем токен на фронтенд
        return res.json({token})

    } catch (error) {
        // TODO: перейти на console.error в блоках catch во всем проекте
        console.error("Error generating LiveKit token:", error)

        return res.status(500).json({
            message: "Server error"
        })
    }
}