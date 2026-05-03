import Game from "../models/gameModel.js"
import {registerChipSockets} from "./socketChips.js"
import {registerCubeSockets} from "./socketCube.js"
import {registerCardSockets} from "./socketCards.js"

export function index(io) {
    io.on("connection", async (socket) => {
        try {
            const {gameId, playerId} = socket.handshake.auth

            // проверяем, что данные переданы
            if (!gameId || !playerId) {
                socket.emit("error", {message: "Missing gameId or playerId"})
                socket.disconnect(true)
                return
            }

            // Защита от старых / удалённых игр
            const game = await Game.findOne({gameId, isActive: true})
            if (!game) {
                socket.emit("error", {message: "Game not found or inactive"})
                socket.disconnect(true)
                return
            }

            // Проверка игрока
            const player = game.players.find(p => p.playerId === playerId)
            if (!player) {
                socket.emit("error", {message: "Player not found in this game"})
                socket.disconnect(true)
                return
            }

            // 👉 сохраняем в socket для доступа к данным в других модулях и функциях на бэке
            socket.gameId = gameId
            socket.playerId = playerId

            // 🔥 Игрок онлайн
            await Game.updateOne(
                {gameId, "players.playerId": playerId},
                {
                    $set: {
                        "players.$.socketId": socket.id,
                        "players.$.isOnline": true
                    }
                }
            )

            socket.join(gameId)

            // регистрируем обработчики
            registerChipSockets(io, socket)
            registerCubeSockets(io, socket)
            registerCardSockets(io, socket)

            // отправляем состояние
            socket.emit("cube:state", {cube: game.cube})

            io.to(gameId).emit("players:update")

            // 🔥 Disconnect
            socket.on("disconnect", async () => {
                await Game.updateOne(
                    {gameId, "players.playerId": playerId},
                    {
                        $set: {
                            "players.$.isOnline": false,
                            "players.$.socketId": null
                        }
                    }
                )
                io.to(gameId).emit("players:update")
            })

        } catch (err) {
            console.error("Socket connection error:", err)
            socket.emit("error", {
                message: "Internal server error during socket connection"
            })
            socket.disconnect(true)
        }
    })
}