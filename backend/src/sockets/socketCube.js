export function registerCubeSockets(io, socket) {
    socket.on("cube:roll", ({ gameId }) => {
        io.to(gameId).emit("cube:rolling")

        const value = Math.ceil(Math.random() * 6)

        const spins = 4 + Math.floor(Math.random() * 2)

        setTimeout(() => {
            io.to(gameId).emit("cube:rolled", {
                value,
                rollId: Date.now(),
                spins
            })
        }, 0)
    })
}