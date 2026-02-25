import mongoose from "mongoose";

export const CARD_TYPES = ["plants", "animals", "creatures", "wisdom", "mac", "swamp"]

const cardSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },

        cardType: {
            type: String,
            required: true,
            enum: CARD_TYPES,
            index: true,
        },
    },
    { timestamps: true }
)

const Card = mongoose.model("Card", cardSchema);

export default Card;
