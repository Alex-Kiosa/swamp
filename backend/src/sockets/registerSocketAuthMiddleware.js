import jwt from "jsonwebtoken"

export function registerSocketAuthMiddleware(io) {
    // регистрируем middleware внутри io
    // io.use - это встроенный pipeline (конвейер) Socket.IO
    // примерно так внутри: io._middlewares.push(fn)
    io.use(socketAuthMiddleware)
}

// мутируем объект socket c помощью middleware
function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth?.token

    if (!token) {
        return next(new Error("Socket unauthorized: no token"))
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        socket.data.playerId = payload.playerId
        socket.data.gameId = payload.gameId

        next()
    } catch (err) {
        next(new Error("Socket unauthorized: invalid token"))
    }
}
