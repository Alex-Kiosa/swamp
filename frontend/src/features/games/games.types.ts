import type {ChipType} from "./chips.types.ts";

export type PlayerType = {
    name: string,
    socketId: string
}

export type GameType = {
    gameId: string | null
    hostId?: string
    players: PlayerType[]
    chips: ChipType[]
    isActive: boolean
}