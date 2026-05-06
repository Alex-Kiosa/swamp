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

        const newSocket = createSocket(socketToken)
        setSocket(newSocket)

        const handleConnect = () => {
            console.log("🟢 CONNECTED", newSocket.id)
            newSocket.emit("game:init")
        }

        newSocket.on("connect", handleConnect)

        newSocket.on("disconnect", () => {
            console.log("🔴 DISCONNECTED")
        })

        newSocket.on("connect_error", (err) => {
            console.log("❌ CONNECT ERROR", err.message)
        })

        return () => {
            newSocket.off("connect", handleConnect)
            newSocket.disconnect()
        }
    }, [gameId, socketToken])

    return socket
}