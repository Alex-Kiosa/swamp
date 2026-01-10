import mongoose from 'mongoose';

const chipSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
        index: true,
    },
    position: {
        type: {x: Number, y: Number},
        required: true,
        _id: false,
    },
    color: {type: String, required: true},
    shape: {type: String, enum: ["Circle", "Square", "Triangle"], default: "Circle"},
},{timestamps: true});

const Chip = mongoose.model('Chip', chipSchema);

export default Chip;