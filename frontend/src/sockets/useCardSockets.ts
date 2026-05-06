import { useEffect } from "react"
import { useAppDispatch } from "../common/hooks/hooks"
import {
    addCardToTable,
    removeCardFromTable,
    resetState,
    setDeckCards,
    setDeckEmpty
} from "../features/cards/model/cardSlice"
import type { Socket } from "socket.io-client"

export const useCardSockets = (socket: Socket | null) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!socket) return

        const onInit = ({ tableCards, decks }: any) => {
            dispatch(resetState({ tableCards, decks }))
        }

        const onDeckCards = ({ type, cards }: any) => {
            dispatch(setDeckCards({ type, cards }))
        }

        const onAdded = (card: any) => {
            dispatch(addCardToTable(card))
        }

        const onRemoved = ({ cardId }: any) => {
            dispatch(removeCardFromTable(cardId))
        }

        const onEmpty = ({ type }: any) => {
            dispatch(setDeckEmpty(type))
        }

        socket.on("cards:init", onInit)
        socket.on("deck:cards", onDeckCards)
        socket.on("card:addedToTable", onAdded)
        socket.on("card:removedFromTable", onRemoved)
        socket.on("card:deckEmpty", onEmpty)

        return () => {
            socket.off("cards:init", onInit)
            socket.off("deck:cards", onDeckCards)
            socket.off("card:addedToTable", onAdded)
            socket.off("card:removedFromTable", onRemoved)
            socket.off("card:deckEmpty", onEmpty)
        }
    }, [socket])
}