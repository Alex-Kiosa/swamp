export type CardCategoryType = "plants" | "animals" | "wisdom" | "creatures"

export const DECK_TYPES = [
    "plants",
    "animals",
    "wisdom",
    "creatures",
] as const

export type DeckType = typeof DECK_TYPES[number]
