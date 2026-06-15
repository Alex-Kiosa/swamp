import {verifySocketToken} from "../services/socketTokenService.js";

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
        const payload = verifySocketToken(token)

        socket.data.playerId = payload.playerId
        socket.data.gameId = payload.gameId

        next()
    } catch (error) {
        console.log("JWT VERIFY ERROR:", error)
        next(error)
    }
}
