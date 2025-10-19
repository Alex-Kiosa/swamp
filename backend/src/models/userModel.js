import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: "Role"}]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;