import {v4 as uuid} from "uuid"
import Game from "../models/gameModel.js"
import {shuffleDeck} from "../services/deckService.js"

export function registerCardSockets(io, socket) {
    socket.on("game:init", async () => {
        const gameId = socket.data.gameId

        const game = await Game.findOne({gameId})
        if (!game) return

        socket.emit("cards:init", {
            tableCards: game.tableCards,
            decks: game.decks
        })
    })

    socket.on("deck:getCards", async ({gameId, type}) => {
        const game = await Game.findOne({gameId})
        if (!game) return

        if (!game.decks[type].length) {
            const discardPile = game.discardPiles[type]

            if (discardPile.length) {
                game.decks[type] = shuffleDeck(discardPile)
                game.discardPiles[type] = []

                await game.save()

                // TODO: на фронте сделать уведомление о том,
                // что колода автоматически перемешана из сброса
                io.to(gameId).emit("deck:reshuffled", {type})
            } else {
                // TODO: на фронте сделать вывод этого сообщения в Toast
                io.to(gameId).emit("card:deckEmpty", {type})
                return
            }
        }

        io.to(gameId).emit("deck:open", {
            type,
            cards: game.decks[type]
        })
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
        game.tableCards.unshift(tableCard)

        console.log("add to table")

        await game.save()

        io.to(gameId).emit("card:addedToTable", tableCard)
    })

    socket.on("card:removeFromTable", async ({gameId, cardId}) => {
        const game = await Game.findOne({gameId})
        if (!game) return

        const card = game.tableCards.find(c => c.id === cardId)

        if (card) {
            game.discardPiles[card.type].push(card.imageUrl)
        }

        game.tableCards = game.tableCards.filter(c => c.id !== cardId)

        await game.save()

        io.to(gameId).emit("card:removedFromTable", {cardId})
    })

    socket.on("deck:closeDeck", ({gameId, type}) => {
        io.to(gameId).emit("deck:close", {type})
    })
}