import Game from "../models/gameModel.js"
import {registerChipSockets} from "./socketChips.js"
import {registerCubeSockets} from "./socketCube.js"
import {registerCardSockets} from "./socketCards.js"

export function socketIndex(io) {
    // внутри io уже есть данные от middleware - socket.gameId и т.д.
    io.on("connection", async (socket) => {
        try {
            const {gameId, playerId} = socket.data

            // проверяем, что игра и игрок существуют
            const game = await Game.findOne({
                gameId,
                isActive: true,
                "players.playerId": playerId
            })
            if (!game) {
                console.log("Game not found")
                socket.emit("error", { message: "Game not found" })
                return socket.disconnect(true)
            }

            // 👉 ставим онлайн (ВАЖНО: через findOneAndUpdate, чтобы сразу получить новое состояние)
            const updatedGame = await Game.findOneAndUpdate(
                {
                    gameId,
                    "players.playerId": playerId
                },
                {
                    $set: {
                        "players.$.socketId": socket.id,
                        "players.$.isOnline": true
                    }
                },
                { new: true }
            )
            // защита от редких edge cases
            if (!updatedGame) {
                console.log("updatedGame not found")
                return
            }

            socket.join(gameId)
            // console.log("ROOM JOINED:", socket.rooms)
            // io.to(gameId).emit(...) отправляет событие всем сокетам в комнате
            // socket.emit(...) отправляет событие только текущему сокету
            // 🔥 сразу отправляем актуальных игроков ВСЕМ
            io.to(gameId).emit("players:update", updatedGame.players)
            io.to(gameId).emit("cube:state", { cube: updatedGame.cube })

            // регистрируем обработчики
            registerChipSockets(io, socket)
            registerCubeSockets(io, socket)
            registerCardSockets(io, socket)

            // 🔥 disconnect с защитой от race condition
            socket.on("disconnect", async () => {
                await Game.updateOne(
                    {
                        gameId,
                        "players.playerId": playerId,
                        "players.socketId": socket.id
                    },
                    {
                        $set: {
                            "players.$.isOnline": false,
                            "players.$.socketId": null
                        }
                    }
                )

                const updatedGame = await Game.findOne({ gameId })
                io.to(gameId).emit("players:update", updatedGame.players)
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