import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    value: {type: String, unique: true, default: "USER"}
})

const User = mongoose.model('Role', roleSchema);

export default Role;