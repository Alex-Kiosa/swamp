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
import {useToast} from "../contexts/ToastContext.tsx";

export const useCardSockets = (socket: Socket | null) => {
    const dispatch = useAppDispatch()
    const { showToast } = useToast()

    const deckNames: Record<string, string> = {
        plants: "Растения",
        animals: "Животные",
        creatures: "Существа",
        wisdom: "Мудрости",
        mac: "МАК",
        swamp: "Болото"
    }

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

            showToast({
                type: "warning",
                message: `Колода "${deckNames[type] ?? type}" пуста`
            })
        }

        const onReshuffled = ({ type }: any) => {
            showToast({
                type: "info",
                message: `Колода "${deckNames[type] ?? type}" автоматически перемешана`
            })
        }

        socket.on("cards:init", onInit)
        socket.on("deck:open", onDeckCards)
        socket.on("card:addedToTable", onAdded)
        socket.on("card:removedFromTable", onRemoved)
        socket.on("card:deckEmpty", onEmpty)
        socket.on("deck:reshuffled", onReshuffled)

        return () => {
            socket.off("cards:init", onInit)
            socket.off("deck:open", onDeckCards)
            socket.off("card:addedToTable", onAdded)
            socket.off("card:removedFromTable", onRemoved)
            socket.off("card:deckEmpty", onEmpty)
            socket.off("deck:reshuffled", onReshuffled)
        }
    }, [socket])
}