import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    hostId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    roomId: {type: String, unique: true, required: true},
    players: [{name: String, socketId: String}],
    limitPlayers: {type: Number, default: 15},
    // chips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chip" }],
    isActive: {type: Boolean, default: true},
}, {timestamps: true});

const Game = mongoose.model('Game', gameSchema);

export default Game;