import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import type {ChipType} from "../chips.types.ts"
import type {GameType, GameTypeWithChips} from "../games.types.ts"

export type gameStatusType = "idle" | "loading" | "succeeded" | "not_found" | "failed"

const initialState: GameTypeWithChips = {
    gameId: null,
    hostId: null,
    players: [],
    chips: [],
    isActive: false,
    isHost: false,
    limitPlayers: 15,
    cube: 1,
    status: "idle",
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        createGame: (state, action: PayloadAction<{ game: GameType }>) => {
            Object.assign(state, action.payload)
            state.status = "succeeded"
            state.isHost = true
        },

        getGamePending: (state) => {
            state.status = "loading"
        },

        getGameSuccess: (state, action: PayloadAction<GameType>) => {
            Object.assign(state, action.payload)
            state.status = "succeeded"
        },

        getGameNotFound: (state) => {
            state.status = "not_found"
        },

        getGameFailed: (state) => {
            state.status = "failed"
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
    getGamePending,
    getGameSuccess,
    getGameFailed,
    getGameNotFound,
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
