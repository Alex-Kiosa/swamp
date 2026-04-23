import { io } from "socket.io-client"

const url = import.meta.env.VITE_SOCKET_URL

export const socket = io(url, {
    transports: ["websocket"],
    // подключим socket позже, после ввода имени игрока
    autoConnect: false,
})