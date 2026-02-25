export type CardCategoryType = "plants" | "animals" | "wisdom" | "creatures" | "mac" | "swamp"

export const DECK_TYPES = [
    "plants",
    "animals",
    "wisdom",
    "mac",
    "creatures",
    "swamp",
] as const

export type DeckType = typeof DECK_TYPES[number]
