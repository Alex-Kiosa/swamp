import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    value: {type: "USER" || "HOST" || "ADMIN", unique: true, default: "USER"}
})

const Role = mongoose.model('Role', roleSchema);

export default Role