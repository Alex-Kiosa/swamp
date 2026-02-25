import {useEffect, useRef} from "react"
import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks"
import {useParams} from "react-router"
import {socket} from "../../../sockets/socket"
import type {RootState} from "../../../app/store"
import type {CardCategoryType} from "../card.types"
import {closeDeck, openDeck, setDeckCards} from "../model/cardSlice.ts"
import {type ModalHandle, Modal} from "../../../pages/Game/modal/Modal.tsx";

type Props = {
    type: CardCategoryType
    title: string
    cardBack: string
}

export const DeckCard = ({type, title, cardBack}: Props) => {
    const {gameId} = useParams<{ gameId: string }>()
    const dispatch = useAppDispatch()
    const modalRef = useRef<ModalHandle>(null)

    const decks = useAppSelector((state: RootState) => state.cards.decks[type])

    const openDeckHandler = () => {
        if (!gameId) return
        modalRef.current?.open()
        socket.emit("deck:getCards", {gameId, type})
    }

    const handleCardClick = (imageUrl: string) => {
        if (!gameId) return

        socket.emit("card:addToTable", {gameId, type, imageUrl})
        modalRef.current?.close()
        dispatch(closeDeck(type))
    }

    const closeModalHandler = () => {
        socket.emit("deck:closeDeck", {gameId, type})
    }

    useEffect(() => {
        const deckOpenHandler = ({type: deckType, cards: deckCards}: { type: CardCategoryType; cards: string[] }) => {
            if (deckType === type) {
                dispatch(setDeckCards({type: deckType, cards: deckCards}))
                dispatch(openDeck(deckType))
                modalRef.current?.open()
            }
        }

        const deckCloseHandler = ({type: deckType}: {
            type: CardCategoryType
        }) => {
            if (deckType === type) {
                dispatch(closeDeck(deckType))
                modalRef.current?.close()
            }
        }

        socket.on("deck:open", deckOpenHandler)
        socket.on("deck:close", deckCloseHandler)

        return () => {
            socket.off("deck:open", deckOpenHandler)
            socket.off("deck:close", deckCloseHandler)
        }
    }, [type])

    return (
        <>
            <div>
                <img
                    src={cardBack}
                    alt={title}
                    className="cursor-pointer rounded-md w-lg p-1 bg-white shadow-xl transition hover:-translate-y-1/4 hover:shadow-2xl"
                    onClick={openDeckHandler}
                />
            </div>

            {
                // TODO: Сделать управления модалкой через state, а не через ref.
                // TODO: Вынести модалку с выбором колод в отдельный компонет?
            }

            <Modal
                ref={modalRef}
                title={title}
                classNames={"max-w-none"}
                width={"80-vw"}
                onClickBackdrop={closeModalHandler}
            >
                <div className="grid grid-cols-9 gap-4">
                    {decks.map((card) => (
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
