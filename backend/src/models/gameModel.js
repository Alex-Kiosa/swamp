import mongoose from "mongoose"

/**
 * Embedded Player (НЕ отдельная модель)
 */
const playerSchema = new mongoose.Schema(
    {
        playerId: {
            type: String,
            required: true, // uuid / nanoid
        },

        name: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["HOST", "PLAYER"],
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null, // только для HOST
        },

        socketId: {
            type: String,
        },

        isOnline: {
            type: Boolean,
            default: true,
        },
    },
    { _id: false } // _id не нужен, чтобы не плодить ненужные ObjectId
)

const gameSchema = new mongoose.Schema(
    {
        gameId: {
            type: String,
            unique: true,
            required: true,
        },

        hostUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        players: {
            type: [playerSchema],
            default: [],
        },

        limitPlayers: {
            type: Number,
            default: 15,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

const Game = mongoose.model("Game", gameSchema)

export default Game