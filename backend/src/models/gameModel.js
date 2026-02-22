import mongoose from "mongoose"

const CARD_TYPES = ["plants", "animals", "creatures", "wisdom"]

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
            default: null
        },
        isOnline: {
            type: Boolean,
            default: false
        },
    },
    { _id: false }
)

const tableCardSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: CARD_TYPES,
            required: true
        }
    },
    { _id: false }
)

const gameSchema = new mongoose.Schema(
    {
        gameId: {
            type: String,
            unique: true,
            required: true,
            index: true
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
            plants: { type: [String], default: [] },
            animals: { type: [String], default: [] },
            creatures: { type: [String], default: [] },
            wisdom: { type: [String], default: [] }
        },
        // Сброс (для механики перемешать сброс)
        discardPiles: {
            plants: { type: [String], default: [] },
            animals: { type: [String], default: [] },
            creatures: { type: [String], default: [] },
            wisdom: { type: [String], default: [] }
        },
        tableCards: {
            type: [tableCardSchema],
            default: []
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