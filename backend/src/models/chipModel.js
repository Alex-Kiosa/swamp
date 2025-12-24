import mongoose from 'mongoose';

const chipSchema = new mongoose.Schema({
    roomId: {
        type: String,
        index: true,
    },
    position: {
        type: {x: Number, y: Number},
        required: true,
    },
    color: {type: String, required: true},
    shape: {type: String, enum: ["Circle", "Square", "Triangle"], default: "Circle"},
},{timestamps: true});

const Chip = mongoose.model('Chip', chipSchema);

export default Chip;