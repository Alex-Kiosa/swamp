import User from "../models/userModel.js";

export const register = async (req, res) => {
    try {
        const {email, password} = req.body

        // Check email existence
        const existingUser = await User.findOne({email})
        console.log("test controller");
        if (existingUser) {
            console.log("❌ Пользователь уже есть в базе, возвращаем 400");
            console.log(res.status)
        }
    } catch (error) {
        req.status(500).json({message: "Ошибка сервера"})
    }
}