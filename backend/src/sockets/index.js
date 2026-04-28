import Game from "../models/gameModel.js"
import {registerChipSockets} from "./socketChips.js"
import {registerCubeSockets} from "./socketCube.js"
import {registerCardSockets} from "./socketCards.js"

export function index(io) {
    // когда соединение установлено, библиотека генерирует событие connection
    io.on("connection", async (socket) => {
        const {gameId, playerId} = socket
        const token = socket.handshake.auth?.token

        // защита от левых подключений
        if (!gameId || !playerId) {
            socket.disconnect(true)
            return
        }

        registerChipSockets(io, socket)
        registerCubeSockets(io, socket)
        registerCardSockets(io, socket)

        // 🔥 Игрок онлайн
        await Game.updateOne(
            {gameId, "players.playerId": playerId},
            {
                // $ - MongoDB запоминает, какой именно элемент массива подошёл и через этот символ можно к нему обратиться
                $set: {
                    "players.$.socketId": socket.id,
                    "players.$.isOnline": true
                }
            }
        )

        socket.join(gameId)

        // Send actual game state to new player
        const game = await Game.findOne({gameId, isActive: true})
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
    })
}