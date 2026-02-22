import type {CardCategoryType} from "../card.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export type TableCard = {
    id: string
    imageUrl: string
    type: CardCategoryType
}

export type OpenDeckModal = {
    type: CardCategoryType
    isOpen: boolean
}

export type CardState = {
    decks: Record<CardCategoryType, string[]>
    tableCards: TableCard[]
    deckEmpty: Record<CardCategoryType, boolean>
    openDecks: OpenDeckModal[]  // какие колоды открыты
}

const initialState: CardState = {
    decks: { plants: [], animals: [], creatures: [], wisdom: [] },
    tableCards: [],
    deckEmpty: { plants: false, animals: false, creatures: false, wisdom: false },
    openDecks: []
}

export const cardSlice = createSlice({
    name: "cards",
    initialState,
    reducers: {
        setDeckCards: (state, action: PayloadAction<{ type: CardCategoryType; cards: string[] }>) => {
            state.decks[action.payload.type] = action.payload.cards
        },
        addCardToTable: (state, action: PayloadAction<TableCard>) => {
            state.tableCards.push(action.payload)
        },
        removeCardFromTable: (state, action: PayloadAction<string>) => {
            state.tableCards = state.tableCards.filter(c => c.id !== action.payload)
        },
        setDeckEmpty: (state, action: PayloadAction<CardCategoryType>) => {
            state.deckEmpty[action.payload] = true
        },
        openDeck: (state, action: PayloadAction<CardCategoryType>) => {
            const deck = state.openDecks.find(d => d.type === action.payload)
            if (!deck) state.openDecks.push({ type: action.payload, isOpen: true })
            else deck.isOpen = true
        },
        closeDeck: (state, action: PayloadAction<CardCategoryType>) => {
            const deck = state.openDecks.find(d => d.type === action.payload)
            if (deck) deck.isOpen = false
        },
        resetState: (
            state,
            action: PayloadAction<{
                tableCards: TableCard[]
                decks: Record<CardCategoryType, string[]>
            }>
        ) => {
            state.tableCards = action.payload.tableCards
            state.decks = action.payload.decks
        },
    }
})

export const { setDeckCards, addCardToTable, removeCardFromTable, setDeckEmpty, openDeck, closeDeck, resetState } = cardSlice.actions
export default cardSlice.reducer
