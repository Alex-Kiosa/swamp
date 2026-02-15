export function registerCubeSockets(io, socket) {
    socket.on("cube:roll", ({gameId}) => {
        io.to(gameId).emit("cube:rolling")

        const value = Math.ceil(Math.random() * 6)

        io.to(gameId).emit("cube:rolled", {
            value,
            rollId: Date.now()
        })
    })
}
