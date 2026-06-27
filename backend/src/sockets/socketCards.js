import {v4 as uuid} from "uuid"
import Game from "../models/gameModel.js"
import {shuffleDeck} from "../services/deckService.js"

// TODO: Есть спорный момент в механике регенерации колод.
// Сейчас колода восстанавливается, если она пуста и в сбросе есть хотя бы одна карта.
// Нужно позже определить желаемое игровое правило.
// Один из рассматриваемых вариантов: разрешать регенерацию только тогда, когда на столе не осталось карт соответствующего типа.

export function registerCardSockets(io, socket) {
    socket.on("game:init", async () => {
        try {
            const gameId = socket.data.gameId

            const game = await Game.findOne({gameId})
            if (!game) return

            socket.emit("cards:init", {
                tableCards: game.tableCards,
                decks: game.decks
            })
        } catch (error) {
            console.error("game:init", error)
        }
    })

    socket.on("deck:getCards", async ({gameId, type}) => {
        try {
            const game = await Game.findOne({gameId})
            if (!game) return

            // сдать колоду заново, если пустая
            if (!game.decks[type].length) {
                const discardPile = game.discardPiles[type]

                if (discardPile.length) {
                    // Защита от дублей в случае непредвиденного бага с помощью Set
                    const uniqueCards = [...new Set(discardPile)]
                    game.decks[type] = shuffleDeck(uniqueCards)
                    game.discardPiles[type] = []

                    await game.save()

                    io.to(gameId).emit("deck:reshuffled", {type})
                } else {
                    io.to(gameId).emit("card:deckEmpty", {type})
                    return
                }
            }

            io.to(gameId).emit("deck:open", {
                type,
                cards: game.decks[type]
            })
        } catch (error) {
            console.error("deck:getCards", error)
        }
    })

    socket.on("card:addToTable", async ({gameId, type, imageUrl}) => {
        try {
            const game = await Game.findOne({gameId})
            if (!game) return

            // дополнительная проверка перед добавлением карты
            const alreadyOnTable = game.tableCards.some(
                card => card.imageUrl === imageUrl
            )

            if (alreadyOnTable) {
                return
            }

            game.decks[type] = game.decks[type].filter(c => c !== imageUrl)

            const tableCard = {
                id: uuid(),
                imageUrl,
                type
            }

            if (!game.tableCards) game.tableCards = []
            game.tableCards.unshift(tableCard)

            await game.save()

            io.to(gameId).emit("card:addedToTable", tableCard)
        } catch (error) {
            console.error("card:addToTable", error)
        }
    })

    socket.on("card:removeFromTable", async ({gameId, cardId}) => {
        try {
            const game = await Game.findOne({gameId})
            if (!game) return

            const card = game.tableCards.find(c => c.id === cardId)

            if (card) {
                game.discardPiles[card.type].push(card.imageUrl)
            }

            game.tableCards = game.tableCards.filter(c => c.id !== cardId)

            await game.save()

            io.to(gameId).emit("card:removedFromTable", {cardId})
        } catch (error) {
            if (error.name === "VersionError") {
                console.warn(
                    "[card:removeFromTable] Card was already modified by another request",
                    { gameId, cardId }
                )

                return
            }

            console.error("card:removeFromTable", error)
        }
    })

    socket.on("deck:closeDeck", ({gameId, type}) => {
        io.to(gameId).emit("deck:close", {type})
    })
}