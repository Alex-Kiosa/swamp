import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {validationResult} from "express-validator";

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

        res.status(201).json({
            message: "User was created",
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles
            }
        })

    } catch (error) {
        res.status(500).json({message: 'server error'})
        console.log('Server error', error)
    }
}

export async function login(req, res) {
    try {
        const {email, password} = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({message: `User not found`})
        }

        const isPassValid = await bcrypt.compare(password, user.password)
        if (!isPassValid) {
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
        console.error('Error in /auth:', error)
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export async function getUsers(req, res) {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: 'server error'})
        console.log('Server error ', error)
    }
}