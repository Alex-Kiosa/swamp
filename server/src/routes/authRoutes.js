import express from "express";
import {registration} from "../controlers/authController.js";
import {check, validationResult} from "express-validator";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const router = express.Router();

// router.get('/test', (req, res) => {
//     res.status(200).send('Authorization API is working')
// })

router.post(
    '/registration',
    [
        check('name', 'Укажите Ваше имя').notEmpty(),
        check('email', 'Введите корректный email').isEmail(),
        check('password', 'Длина пароля должна быть от 6 до 15 символов')
            .isLength({ min: 6, max: 15 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { name, email, password } = req.body

            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: `User with email ${email} already exists` })
            }

            // Hash password
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({ name, email, password: hashPassword })
            await user.save()

            res.json({ message: "User was created" })
        } catch (error) {
            console.log('Server error', error)
            res.status(500).json({ message: 'server error' })
        }
    }
)

export default router;