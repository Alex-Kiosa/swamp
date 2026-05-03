import mongoose from "mongoose";

const emailQueueSchema = new mongoose.Schema({
    to: String,
    subject: String,
    html: String,
    status: {
        type: String,
        enum: ["pending", "processing", "sent", "failed"],
        default: "pending"
    },
    attempts: {
        type: Number,
        default: 3
    },
    lastError: String,
    lockedAt: Date
}, {
    timestamps: true
})

const EmailQueue = mongoose.model("EmailQueue", emailQueueSchema)

export default EmailQueue;