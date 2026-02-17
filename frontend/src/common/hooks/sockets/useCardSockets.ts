import { useEffect } from "react"
import { socket } from "../../../socket"
import {useAppDispatch} from "../hooks.ts";
import {openCard, setDeckEmpty} from "../../../features/cards/model/cardSlice.ts";

export const useCardSockets = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {

        socket.on("card:opened", ({ card, type }) => {
            dispatch(openCard({ card, type }))
        })

        socket.on("card:deckEmpty", ({ type }) => {
            dispatch(setDeckEmpty(type))
        })

        return () => {
            socket.off("card:opened")
            socket.off("card:deckEmpty")
        }

    }, [])
}
