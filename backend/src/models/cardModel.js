import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },

        cardType: {
            type: String,
            required: true,
            enum: ["plants", "animals", "creatures", "wisdom"],
            index: true,
        },
    },
    { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);

export default Card;
