const lockedChips = {}
// { [gameId]: { [chipId]: socketId } }

export function registerChipSockets(io, socket) {
    // console.log('registerChipSockets') // выводится
    if (socket.gameId) {
        socket.join(socket.gameId)
    }

    socket.on("chip:drag:start", ({ chipId, gameId }) => {
        // console.log(chipId, gameId) // !!! не выводится
        lockedChips[gameId] ??= {}
        lockedChips[gameId][chipId] = socket.id

        socket.to(gameId).emit("chip:locked", { chipId })
    })

    socket.on("chip:drag:end", ({ chipId, gameId }) => {
        if (lockedChips[gameId]?.[chipId] === socket.id) {
            delete lockedChips[gameId][chipId]
            socket.to(gameId).emit("chip:unlocked", { chipId })
        }
    })

    socket.on("disconnect", () => {
        for (const gameId in lockedChips) {
            const unlocked = []

            for (const [chipId, owner] of Object.entries(lockedChips[gameId])) {
                if (owner === socket.id) {
                    delete lockedChips[gameId][chipId]
                    unlocked.push(chipId)
                }
            }

            if (unlocked.length) {
                socket.to(gameId).emit("chips:unlocked", { chipIds: unlocked })
            }
        }
    })
}
