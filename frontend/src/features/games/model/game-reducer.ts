import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {ChipType} from "../chips.types.ts";
import type {GameType} from "../games.types.ts";

const initialState: GameType = {
    gameId: null,
    players: [],
    chips: [],
    isActive: false,
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        createGame: (state, action: PayloadAction<{ gameId: string }>) => {
            state.gameId = action.payload.gameId
        },
        getGame: (state, action: PayloadAction<{ gameId: string }>) => {
            state.gameId = action.payload.gameId
        },
        createChip: (state, action: PayloadAction<ChipType>) => {
            state.chips.push(action.payload)
        },
        getChips: (state, action: PayloadAction<ChipType[]>) => {
            state.chips = action.payload
        },
        moveChip: (state, action: PayloadAction<ChipType>) => {
            const chip = state.chips.find(
                chip => chip._id === action.payload._id
            )

            if(chip) {
                chip.position.x = action.payload.position.x
                chip.position.y = action.payload.position.y
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const {getGame, createGame, getChips, createChip, moveChip} = gameSlice.actions
export default gameSlice.reducer
