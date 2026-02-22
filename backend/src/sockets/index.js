import Game from "../models/gameModel.js"
import { registerChipSockets } from "./socketChips.js"
import { registerCubeSockets } from "./socketCube.js"
import { registerCardSockets } from "./socketCards.js"

export function index(io) {
    // когда соединение установлено, библиотека генерирует событие connection
    io.on("connection", async (socket) => {
        const { gameId, playerId } = socket
        if (!gameId || !playerId) return

        // console.log("NEW CONNECTION")

        registerChipSockets(io, socket)
        registerCubeSockets(io, socket)
        registerCardSockets(io, socket)
        // console.log("CARD SOCKETS REGISTERED")

        // 🔥 Игрок онлайн
        await Game.updateOne(
            { gameId, "players.playerId": playerId },
            {
                // $ - MongoDB запоминает, какой именно элемент массива подошёл и через этот символ можно к нему обратиться
                $set: {
                    "players.$.socketId": socket.id,
                    "players.$.isOnline": true
                }
            }
        )

        socket.join(gameId)

        io.to(gameId).emit("players:update")

        // 🔥 Disconnect
        socket.on("disconnect", async () => {
            await Game.updateOne(
                { gameId, "players.playerId": playerId },
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