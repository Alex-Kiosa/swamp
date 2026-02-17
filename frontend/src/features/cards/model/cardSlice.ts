import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CardCategoryType } from "../card.types.ts"

export type CardState = {
    openedCards: Record<CardCategoryType, string | null>
    deckEmpty: Record<CardCategoryType, boolean>
}

const initialState: CardState = {
    openedCards: {
        plants: null,
        animals: null,
        creatures: null,
        wisdom: null
    },
    deckEmpty: {
        plants: false,
        animals: false,
        creatures: false,
        wisdom: false
    }
}

export const cardSlice = createSlice({
    name: "cards",
    initialState,
    reducers: {

        openCard: (
            state,
            action: PayloadAction<{ card: string; type: CardCategoryType }>
        ) => {
            const { card, type } = action.payload
            state.openedCards[type] = card
            state.deckEmpty[type] = false
        },

        setDeckEmpty: (
            state,
            action: PayloadAction<CardCategoryType>
        ) => {
            state.deckEmpty[action.payload] = true
        }
    }
})

export const { openCard, setDeckEmpty } = cardSlice.actions
export default cardSlice.reducer
