import Game from "../models/gameModel.js";

export function registerCardSockets(io, socket) {
    socket.on("card:draw", async ({ gameId, type }) => {
        const game = await Game.findOne({ gameId })
        if (!game) return

        const deck = game.decks[type]

        console.log("TYPE:", type)
        console.log("DECK KEYS:", Object.keys(game.decks))
        console.log("DECK VALUE:", game.decks[type])

        if (!deck || deck.length === 0) {
            io.to(gameId).emit("card:deckEmpty", {type})
            return
        }

        // 🎲 берём верхнюю карту
        const card = deck.shift()

        // кладём в discard
        game.discardPiles[type].push(card)

        await game.save()

        // console.log("📩 card:draw received", type)

        // отправляем всем игрокам только открытую карту
        io.to(gameId).emit("card:opened", {
            card,
            type
        })
    })
}
