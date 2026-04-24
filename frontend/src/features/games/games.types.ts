import type {ChipType} from "./chips.types.ts";
import type {gameStatusType} from "./model/gameSlice.ts";

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
    cube: number
}

export type GameTypeWithChips = GameType & { chips: ChipType[], status: gameStatusType }