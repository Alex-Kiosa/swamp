import mongoose from "mongoose"

const playerSchema = new mongoose.Schema(
    {
        playerId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["HOST", "PLAYER"],
            required: true
        },
        socketId: {
            type: String,
        },
        isOnline: {
            type: Boolean,
        },
    },
    {_id: false} // _id не нужен, чтобы не плодить ненужные ObjectId
)

const gameSchema = new mongoose.Schema(
    {
        gameId: {
            type: String,
            unique: true,
            required: true,
        },
        hostId: {
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
        cube: {
            type: Number,
            enum: [1, 2, 3, 4, 5, 6],
            default: 1,
        },
        decks: {
            plants: [String],
            animals: [String],
            wisdom: [String],
            creatures: [String],
        },
        discardPiles: {
            plants: [String],
            animals: [String],
            wisdom: [String],
            creatures: [String],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {timestamps: true}
)

const Game = mongoose.model("Game", gameSchema)

export default Game