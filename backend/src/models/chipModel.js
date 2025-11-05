import mongoose from 'mongoose';

const chipSchema = new mongoose.Schema({
    id: {type: String, unique: true},
    positions: [{x: String, y: String}],
    color: {type: String, required: true},
    shape: {type: String, default: "Circle"},
});

const Chip = mongoose.model('Chip', chipSchema);

export default Chip;