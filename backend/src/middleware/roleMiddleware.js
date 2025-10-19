import jwt from "jsonwebtoken";

export function roleMiddleware(roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = req.headers.authorization.split(" ")[1]
            if (!token) {
                return res.status(403).json({message: "User is unauthorized"})
            }
            const secretKey = process.env.JWT_SECRET
            const data = jwt.verify(token, secretKey)
            const userRoles = data.roles

            let hasRole = false
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })

            if (!hasRole) {
                return res.status(403).json({message: "Access denied. User don't have permissions"})
            }

            next()
        } catch (error) {
            console.log(error)
            return res.status(403).json({message: "User is unauthorized"})
        }
    }
}