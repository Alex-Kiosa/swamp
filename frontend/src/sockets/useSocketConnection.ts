import { useEffect, useState } from "react"
import { createSocket } from "./socket"
import type { Socket } from "socket.io-client"

export const useSocketConnection = (
    gameId?: string,
    socketToken?: string | null
) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        if (!gameId || !socketToken) return

        let currentSocketId: string | undefined

        const newSocket = createSocket(socketToken)
        setSocket(newSocket)

        const handleConnect = () => {
            currentSocketId = newSocket.id
            console.log("🟢 CONNECTED SOCKET", currentSocketId)
            newSocket.emit("game:init")
        }

        newSocket.on("connect", handleConnect)

        newSocket.on("disconnect", () => {
            console.log("🔴 DISCONNECTED SOCKET ", currentSocketId)
        })

        return () => {
            newSocket.off("connect", handleConnect)
            newSocket.disconnect()
        }
    }, [gameId, socketToken])

    return socket
}