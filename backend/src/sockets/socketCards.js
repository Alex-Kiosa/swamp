import {v4 as uuid} from "uuid"
import Game from "../models/gameModel.js"

export function registerCardSockets(io, socket) {
    socket.on("game:init", async ({gameId}) => {
        const game = await Game.findOne({gameId})
        if (!game) return

        socket.emit("game:state", {
            tableCards: game.tableCards,
            decks: game.decks
        })
    })

    socket.on("deck:getCards", async ({gameId, type}) => {
        const game = await Game.findOne({gameId})
        if (!game) return

        const deck = game.decks[type]

        if (!deck.length) {
            io.to(gameId).emit("card:deckEmpty", {type})
            return
        }

        io.to(gameId).emit("deck:open", {type, cards: deck})
    })

    socket.on("card:addToTable", async ({gameId, type, imageUrl}) => {
        const game = await Game.findOne({gameId})
        if (!game) return

        game.decks[type] = game.decks[type].filter(c => c !== imageUrl)

        const tableCard = {
            id: uuid(),
            imageUrl,
            type
        }

        if (!game.tableCards) game.tableCards = []
        game.tableCards.push(tableCard)

        await game.save()

        io.to(gameId).emit("card:addedToTable", tableCard)
    })

    socket.on("card:removeFromTable", async ({gameId, cardId}) => {
        console.log("card removed from table", gameId, cardId)
        const game = await Game.findOne({gameId})
        if (!game) return

        game.tableCards = game.tableCards.filter(c => c.id !== cardId)
        await game.save()

        io.to(gameId).emit("card:removedFromTable", {cardId})
    })

    socket.on("deck:closeDeck", ({gameId, type}) => {
        console.log("deck:closeDeck", gameId, type)
        io.to(gameId).emit("deck:close", {type})
    })
}
