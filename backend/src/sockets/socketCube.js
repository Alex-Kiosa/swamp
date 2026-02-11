export function registerCubeSockets(io, socket) {
    socket.on("cube:roll", ({ gameId }) => {
        const value = Math.ceil(Math.random() * 6)

        io.to(gameId).emit("cube:rolled")
    })
}
