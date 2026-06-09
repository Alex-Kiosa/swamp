import {useEffect, useState} from "react"
import type {Socket} from "socket.io-client"
import {createSocket} from "./socket.ts";
import {getSocketToken} from "../features/games/api/gameApi.ts";
import type { AxiosError } from "axios";
import type {ApiErrorResponse} from "../api/api.types.ts";

export const useSocketConnection = (gameId?: string) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        if (!gameId) return

        let newSocket: Socket | null = null
        let currentSocketId: string | undefined

        const connectSocket = async () => {
            try {
                console.log("1. start")

                const socketToken = await getSocketToken(gameId)

                console.log("2. token received", socketToken)

                newSocket = createSocket(socketToken)

                console.log("3. socket created")

                setSocket(newSocket)

                const handleConnect = () => {
                    currentSocketId = newSocket?.id

                    console.log(
                        "🟢 CONNECTED SOCKET",
                        currentSocketId
                    )

                    newSocket?.emit("game:init")
                }

                newSocket.on("connect", handleConnect)

                newSocket.on("connect_error", (err) => {
                    console.log("🔴 CONNECT ERROR", err)
                })

                newSocket.on("disconnect", () => {
                    console.log(
                        "🔴 DISCONNECTED SOCKET",
                        currentSocketId
                    )
                })
            } catch (error) {
                const axiosError = error as AxiosError<ApiErrorResponse>

                console.error(
                    axiosError.response?.data?.message ??
                    axiosError.message
                )
            }
        }

        connectSocket()

        return () => {
            if (newSocket) {
                newSocket.disconnect()
            }
        }
    }, [gameId])

    return socket
}