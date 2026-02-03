import jwt from "jsonwebtoken";

export function optionalAuthMiddleware(req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    // by default we consider the user unauthorized
    req.user = null

    try {
        const authHeader = req.headers.authorization
        if(!authHeader) return next()

        // Wait for the format "Bearer TOKEN" and extract the token
        const token = authHeader.split(" " )[1]
        if (!token) return next()

        // Check the token
        const secretKey = process.env.JWT_SECRET
        const decodedData = jwt.verify(token, secretKey)
        req.user = decodedData
        return next()
    } catch (error) {
        // 7. Любая ошибка = просто гость
        console.log("Optional auth failed:", error.message)
        return next()
    }
}