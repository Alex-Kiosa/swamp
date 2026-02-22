import { useEffect } from "react"
import { socket } from "./socket"

export const useSocketConnection = (
    gameId?: string,
    socketToken?: string | null
) => {
    useEffect(() => {
        if (!gameId || !socketToken) return

        const token = localStorage.getItem("socketToken")
        if (!token) return

        // передаём auth до connect
        socket.auth = { token }

        const handleConnect = () => {
            // console.log("CONNECTED:", socket.id)
            socket.emit("game:init", { gameId })
        }

        // если уже подключён — просто инициализируем
        if (socket.connected) {
            handleConnect()
        } else {
            // событие "connect" генерируется автоматически на клиенте, когда соединение установлено при вызове connect(), одновременно с этим socket.connected становится true
            // обязательно подписываемся на "connect" до вызова connect()
            socket.on("connect", handleConnect)
            socket.connect()
        }

        return () => {
            socket.off("connect", handleConnect)
        }
    }, [gameId, socketToken])
}