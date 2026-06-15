import jwt from "jsonwebtoken";

export function generateSocketToken(gameId, playerId) {
    const secretKey = process.env.SOCKET_JWT_SECRET

    if (!secretKey) {
        throw new Error("SOCKET JWT_SECRET is not defined")
    }

    if (!gameId || !playerId) {
        throw new Error("Invalid payload for socket token")
    }

    const socketToken = jwt.sign(
        {
            gameId,
            playerId
        },
        secretKey,
        {expiresIn: "24h"}
    )

    return socketToken
}

export const verifySocketToken = (token) => {
    return jwt.verify(token, process.env.SOCKET_JWT_SECRET)
}