import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import {validationResult} from "express-validator";
import {queueRecoveryEmail, queueRegEmail} from "../services/emailQueueService.js";

export function generateAccessToken(id, email, roles) {
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign({id, email, roles}, secretKey, {expiresIn: "24h"})
}

export async function createUser(req, res) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {name, email, password} = req.body

        const candidate = await User.findOne({email})
        if (candidate) {
            return res.status(409).json({message: `User with email ${email} already exists`})
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 7);
        const user = new User({name, email, password: hashPassword, roles: ["USER"]})
        await user.save()

        // Queue email (НЕ ждём, не блокируем) кладем задачу в очередь
        queueRegEmail(email, name, password)
            .catch(error => console.error("❌ Queue failed:", error))

        res.status(201).json({
            message: "User was created",
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles
            }
        })

    } catch (error) {
        // res.status(500).json({message: 'Server error during user registration'})
        // console.log('Server error')

        console.error("Server error during user registration:", error)

        res.status(500).json({
            message: 'Server error during user registration'
        })
    }
}

export async function login(req, res) {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user) {
            console.log(email)
            console.log(user)
            return res.status(400).json({message: `User not found`})
        }

        const isPassValid = await bcrypt.compare(password, user.password)
        if (!isPassValid) {
            console.log("pass erorr")
            return res.status(400).json({message: "Invalid email password"})
        }

        const token = generateAccessToken(user.id, user.email, user.roles)

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                createdAt: user.createdAt,
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error"})
    }
}

export async function auth(req, res) {
    try {
        const user = await User.findOne({_id: req.user.id})
        if (!user) {
            return res.status(400).json({message: `User not found`})
        }

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                createdAt: user.createdAt,
            }
        })
    } catch (error) {
        console.error('Error in auth:', error)
        res.status(500).json({message: "Server error"})
    }
}

export async function forgotPassword(req, res) {
    try {
        // TODO:  prevent multiple recovery emails within TTL
        const RESET_PASSWORD_TTL_MS = 30 * 60 * 1000 // 30 минут
        const MESSAGE = "If the email exists, recovery instructions have been sent"
        const {email} = req.body
        const user = await User.findOne({email})
        if (!user) {
            console.log("Password recovery: user not found", {email})

            return res.status(200).json({message: MESSAGE})
        }

        const token = crypto.randomBytes(32).toString("hex")
        // хэшируем токен для безопасности
        const hashToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")

        user.resetPasswordToken = hashToken
        user.resetPasswordExpires = new Date(Date.now() + RESET_PASSWORD_TTL_MS)
        await user.save()

        const recoveryLink =
            `${process.env.FRONT_URL}/reset-password?token=${token}`
        console.log(process.env.FRONT_URL)

        // без await письмо может не попасть в очередь при ошибке.
        await queueRecoveryEmail(email, user.name, recoveryLink)

        return res.status(200).json({message: MESSAGE})
    } catch (error) {
        console.error('Error in forgotPassword:', error)
        res.status(500).json({message: "Server error"})
    }
}

export async function resetPassword(req, res) {
    try {
        const { token, password } = req.body

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            return res.status(400).json({
                code: "INVALID_RESET_TOKEN",
                message: "Invalid or expired recovery link"
            })
        }

        const hashPassword = await bcrypt.hash(password, 7)

        user.password = hashPassword

        // делаем ссылку одноразовой
        user.resetPasswordToken = null
        user.resetPasswordExpires = null

        await user.save()

        return res.status(200).json({
            message: "Password successfully changed"
        })

    } catch (error) {
        console.error("Error in resetPassword:", error)

        return res.status(500).json({
            code: "SERVER_ERROR",
            message: "Server error"
        })
    }
}

export async function getUsers(req, res) {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        console.log('Server error in getUsers:', error)
        res.status(500).json({message: 'server error'})
    }
}