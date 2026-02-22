import {useAppDispatch} from "../common/hooks/hooks.ts";
import {useEffect} from "react";
import {socket} from "./socket.ts";
import {getGameThunk} from "../features/games/actions/games-actions.ts";

export const usePlayerSockets = (gameId?: string) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!gameId) return

        const handler = () => {
            dispatch(getGameThunk(gameId))
        }

        socket.on("players:update", handler)

        return () => {
            socket.off("players:update", handler)
        }
    }, [gameId])
}
