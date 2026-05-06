import {io, Socket} from "socket.io-client"

const url = import.meta.env.VITE_SOCKET_URL

// паттерн "фабричная функция"
export const createSocket = (token: string): Socket => {
    return io(url, {
        transports: ["websocket"],
        auth: { token },
    })
}