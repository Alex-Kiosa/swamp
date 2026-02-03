import type {ChipType} from "./chips.types.ts";

export type PlayerType = {
    name: string,
    socketId: string
}

export type GameType = {
    gameId: string | null
    hostId: string | null
    players: PlayerType[]
    isActive: boolean
    limitPlayers: number
}

export type GameTypeWithChips = GameType & { chips: ChipType[], gameInitialized: boolean }