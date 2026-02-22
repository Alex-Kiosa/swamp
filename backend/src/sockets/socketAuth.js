import jwt from "jsonwebtoken"

export function socketAuthMiddleware(io) {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token

        if (!token) {
            return next(new Error("Socket unauthorized: no token"))
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)

            socket.playerId = payload.playerId
            socket.gameId = payload.gameId
            socket.role = payload.role

            next()
        } catch (err) {
            next(new Error("Socket unauthorized: invalid token"))
        }
    })
}
