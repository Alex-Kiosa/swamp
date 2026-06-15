import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        roles: {
            type: [String],
            enum: ["DEMO_USER", "USER", "ADMIN"],
            default: ["DEMO_USER"],
        },

        // токен восстановления
        resetPasswordToken: {
            type: String,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
        },
        // для защиты от спама, чтобы отправлять письмо не чаще 1 раза в минуту
        // lastPasswordResetRequest: {
        //     type: Date,
        //     default: null,
        // },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
