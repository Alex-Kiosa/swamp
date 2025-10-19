import express from "express";
import {createUser, getUsers, login} from "../controlers/authController.js";
import {check} from "express-validator";
import {roleMiddleware} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post('/registration',
    [
        check('name', 'Name can not be empty').notEmpty(),
        check('email', 'Email can not be empty').isEmail(),
        check('password', 'Password length must be between 6 and 15 characters')
            .isLength({min: 6, max: 15}),
    ],
    createUser
)

router.post('/login', login)

router.get('/users', roleMiddleware, getUsers)

export default router;