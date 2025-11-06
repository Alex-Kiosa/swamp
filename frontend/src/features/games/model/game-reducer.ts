import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export type ChipType = {
    id: string,
    positions: { x: String, y: String },
    color: string,
    shape: string,
}

export type PlayerType = {
    name: string,
    socketId: string
}

export type GameType = {
    roomId: string
    hostId: string
    players: PlayerType[]
    chips: ChipType[]
    createdAt: string
    isActive: boolean
}

type GameStateType = {
    currentGame: GameType | null
}

const initialState: GameStateType = {
    currentGame: null
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        getGame: (state, action: PayloadAction<GameType>) => {
            state.currentGame = action.payload
        },
        createGame: (state, action: PayloadAction<GameType>) => {
            state.currentGame = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const {getGame, createGame} = gameSlice.actions
export default gameSlice.reducer
