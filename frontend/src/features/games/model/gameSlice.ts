import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ChipType } from "../chips.types.ts"
import type { GameType, GameTypeWithChips } from "../games.types.ts"

const initialState: GameTypeWithChips = {
    gameId: null,
    hostId: null,
    players: [],
    chips: [],
    isActive: false,
    isHost: false,
    limitPlayers: 15,
    gameInitialized: false
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        createGame: (state, action: PayloadAction<{ game: GameType }>) => {
            Object.assign(state, action.payload)
            state.gameInitialized = true
            state.isHost = true
        },

        getGame: (state, action: PayloadAction<GameType>) => {
            Object.assign(state, action.payload)
            state.gameInitialized = true
        },

        deleteGame: () => initialState,

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

            if (chip) {
                chip.position.x = action.payload.position.x
                chip.position.y = action.payload.position.y
            }
        },

        deleteChipsByGame: (state) => {
            state.chips = []
        },

        lockChip: (state, action: PayloadAction<string>) => {
            const chip = state.chips.find(c => c._id === action.payload)
            if (chip) chip.isLocked = true
        },

        unlockChip: (state, action: PayloadAction<string>) => {
            const chip = state.chips.find(c => c._id === action.payload)
            if (chip) chip.isLocked = false
        }
    }
})

export const {
    getGame,
    createGame,
    deleteGame,
    getChips,
    createChip,
    moveChip,
    deleteChipsByGame,
    lockChip,
    unlockChip
} = gameSlice.actions

export default gameSlice.reducer
