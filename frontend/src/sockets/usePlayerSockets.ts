import {useEffect} from "react"
import {useAppDispatch} from "../common/hooks/hooks"
import {setPlayers} from "../features/games/model/gameSlice"
import type {Socket} from "socket.io-client"

export const usePlayerSockets = (socket: Socket | null) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!socket) return

        const handler = (players: any[]) => {
            dispatch(setPlayers(players))
        }

        socket.on("players:update", handler)

        return () => {
            socket.off("players:update", handler)
        }
    }, [socket])
}