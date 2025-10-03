import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import {validationResult} from "express-validator";

export const registration = async (req, res) => {
    try {
        const errors = validationResult(req)
        if(errors.isEmpty()) {
            console.log("errors")
            return res.status(400).send({errors: errors.array()})
        }

        const {name, email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: `User with email ${email} already exists`})
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({name, email, password: hashPassword})
        await user.save()
        res.json({message: "User was created"})

    } catch (error) {
        console.log('Server error', error)
        res.status(500).json({message: 'server error'})
    }
}