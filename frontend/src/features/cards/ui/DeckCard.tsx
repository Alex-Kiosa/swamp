import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../common/hooks/hooks"
import { useParams } from "react-router"
import { socket } from "../../../sockets/socket"
import type { RootState } from "../../../app/store"
import type { CardCategoryType } from "../card.types"
import { Modal, type ModalHandle } from "../../../pages/Game/modal/Modal.tsx"
import { closeDeck, openDeck, setDeckCards } from "../model/cardSlice.ts"

type Props = {
    type: CardCategoryType
    title: string
    cardBack: string
}

export const DeckCard = ({ type, title, cardBack }: Props) => {
    const { gameId } = useParams<{ gameId: string }>()
    const dispatch = useAppDispatch()
    const modalRef = useRef<ModalHandle>(null)

    const cards = useAppSelector((state: RootState) => state.cards.decks[type])

    const openDeckHandler = () => {
        if (!gameId) return
        modalRef.current?.open()
        socket.emit("deck:getCards", { gameId, type })
    }

    const handleCardClick = (imageUrl: string) => {
        if (!gameId) return

        socket.emit("card:addToTable", { gameId, type, imageUrl})
        modalRef.current?.close()
        dispatch(closeDeck(type))
    }

    useEffect(() => {
        const deckOpenHandler = ({ type: deckType, cards: deckCards }: { type: CardCategoryType; cards: string[] }) => {
            if (deckType === type) {
                dispatch(setDeckCards({ type: deckType, cards: deckCards }))
                dispatch(openDeck(deckType))
                modalRef.current?.open()
            }
        }

        const deckCloseHandler = ({ type: deckType }: { type: CardCategoryType }) => {
            debugger
            if (deckType === type) {
                modalRef.current?.close()
                socket.emit("deck:closeDeck", { gameId, type })
                dispatch(closeDeck(deckType))
            }
        }

        socket.on("deck:open", deckOpenHandler)
        socket.on("deck:close", deckCloseHandler)

        return () => {
            socket.off("deck:open", deckOpenHandler)
            // socket.off("deck:close", deckCloseHandler)
        }
    }, [dispatch, type])

    return (
        <>
            <div className="flex flex-col items-center">
                <img
                    src={cardBack}
                    alt={title}
                    className="cursor-pointer rounded-md"
                    onClick={openDeckHandler}
                />
            </div>

            <Modal ref={modalRef} title={title} classNames={"max-w-none"} width={"80-vw"} >
                <div className="grid grid-cols-9 gap-4">
                    {cards.map((card) => (
                        <img
                            key={card}
                            src={cardBack}
                            className="cursor-pointer hover:scale-103 transition rounded-md"
                            onClick={() => handleCardClick(card)}
                        />
                    ))}
                </div>
            </Modal>
        </>
    )
}
