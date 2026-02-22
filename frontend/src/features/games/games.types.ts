import type {ChipType} from "./chips.types.ts";

export type PlayerType = {
    name: string,
    socketId: string
    playerId: string
    role: string
    isOnline: boolean
}

export type GameType = {
    gameId: string | null
    hostId: string | null
    players: PlayerType[]
    isActive: boolean
    limitPlayers: number
    isHost: boolean
}

export type GameTypeWithChips = GameType & { chips: ChipType[], gameInitialized: boolean }