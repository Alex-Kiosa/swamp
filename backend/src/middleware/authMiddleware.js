import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
            return res.status(401).json({message: "User is unauthorized"})
        }
        const secretKey = process.env.JWT_SECRET
        const decodedData = jwt.verify(token, secretKey)
        // create new property in object req for next using
        req.user = decodedData
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({message: "User is unauthorized"})
    }
}