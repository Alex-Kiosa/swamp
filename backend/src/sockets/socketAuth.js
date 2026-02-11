import jwt from "jsonwebtoken"

export function socketAuthMiddleware(io) {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token
            const payload = jwt.verify(token, process.env.JWT_SECRET)

            socket.playerId = payload.playerId
            socket.gameId = payload.gameId
            socket.role = payload.role

            next()
        } catch {
            next(new Error("Socket unauthorized"))
        }
    })
}