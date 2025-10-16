import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {validationResult} from "express-validator";

const generateAccessToken1 = (id, email) => {
    const secretKey = process.env.JWT_SECRET
    if (!secretKey) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign({id, email}, secretKey, {expiresIn: "24h"})
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
        const user = new User({name, email, password: hashPassword})
        await user.save()

        res.status(201).json({
            message: "User was created",
            user: {id: user._id, email: user.email}
        })

    } catch (error) {
        res.status(500).json({message: 'server error'})
        console.log('Server error', error)
    }
}

export async function login(req, res) {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: `User not found`})
        }
        const isPassValid = await bcrypt.compare(password, user.password)
        if (!isPassValid) {
            return res.status(400).json({message: "Invalid email password"})
        }

        const token = generateAccessToken1(user._id, user.email)

        return res.json({token})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error"})
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