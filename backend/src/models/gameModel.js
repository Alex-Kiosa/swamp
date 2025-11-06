import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    hostId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    roomId: {type: String, unique: true, required: true},
    players: [{name: String, socketId: String}],
    chips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chip" }],
    createdAt: {type: Date, default: Date.now},
    closedAt: {type: Date, default: null},
    isActive: {type: Boolean, default: true},
}, {timestamps: true});

const Game = mongoose.model('Game', gameSchema);

export default Game;