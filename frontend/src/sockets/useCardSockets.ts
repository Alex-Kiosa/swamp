import { useEffect } from "react"
import { socket } from "./socket"
import { useAppDispatch } from "../common/hooks/hooks"
import {
    setDeckCards,
    addCardToTable,
    setDeckEmpty,
    removeCardFromTable,
    resetState
} from "../features/cards/model/cardSlice"

export const useCardSockets = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        socket.on("game:state", ({ tableCards, decks }) => {
            dispatch(resetState({ tableCards, decks }))
        })

        socket.on("deck:cards", ({ type, cards }) => {
            dispatch(setDeckCards({ type, cards }))
        })

        socket.on("card:addedToTable", (card) => {
            dispatch(addCardToTable(card))
        })

        socket.on("card:removedFromTable", ({cardId}) => {
            dispatch(removeCardFromTable(cardId))
        })

        socket.on("card:deckEmpty", ({ type }) => {
            dispatch(setDeckEmpty(type))
        })

        return () => {
            socket.off("deck:cards")
            socket.off("card:addedToTable")
            socket.off("card:removedFromTable")
            socket.off("card:deckEmpty")
            socket.off("game:state")
        }

    }, [])
}
