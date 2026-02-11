import { registerChipSockets } from "./socketChips.js"
import { registerCubeSockets } from "./socketCube.js"

export function index(io) {
    io.on("connection", (socket) => {
        socket.emit("player:joined", {
            playerId: socket.playerId,
            role: socket.role
        })

        registerChipSockets(io, socket)
        registerCubeSockets(io, socket)
    })
}
