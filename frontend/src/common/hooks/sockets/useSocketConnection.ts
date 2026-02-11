import { useEffect } from "react"
import {socket} from "../../../socket.ts";

export const useSocketConnection = (gameId?: string) => {
    useEffect(() => {
        if (!gameId) return

        const token = localStorage.getItem("socketToken")
        if (!token) return

        socket.auth = { token }

        if (socket.connected) {
            socket.disconnect()
        }

        socket.connect()

        const onError = (err: any) => {
            console.error("❌ socket error", err.message)
        }

        socket.on("connect_error", onError)

        return () => {
            socket.off("connect_error", onError)
            socket.disconnect()
        }
    }, [gameId])
}
