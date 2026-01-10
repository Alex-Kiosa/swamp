import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    hostId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    gameId: {type: String, unique: true, required: true},
    players: [
        {
            name: {type: String, required: true},
            socketId: {type: String}
        }
    ],
    limitPlayers: {type: Number, default: 15},
    isActive: {type: Boolean, default: true},
}, {timestamps: true});

const Game = mongoose.model('Game', gameSchema);

export default Game;