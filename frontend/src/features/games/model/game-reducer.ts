import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export type ChipType = {
    id: string,
    positions: { x: number, y: number },
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
    roomId: string | null
}

const initialState: GameStateType = {
    roomId: null
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        getGame: (state, action: PayloadAction<{ roomId: string }>) => {
            state.roomId = action.payload.roomId
        },
        createGame: (state, action: PayloadAction<{ roomId: string }>) => {
            state.roomId = action.payload.roomId
        },
    }
})

// Action creators are generated for each case reducer function
export const {getGame, createGame} = gameSlice.actions
export default gameSlice.reducer
