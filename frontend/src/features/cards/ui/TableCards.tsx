import {useMemo, useRef, useState, useCallback} from "react"
import {useAppSelector} from "../../../common/hooks/hooks"
import type {RootState} from "../../../app/store"
import {Modal, type ModalHandle} from "../../../pages/Game/modal/Modal"
import {socket} from "../../../sockets/socket"
import {MdOutlineRemoveCircle} from "react-icons/md";

type Props = {
    isHost: boolean
    gameId: string
}

export const TableCards = ({isHost, gameId}: Props) => {
    const cards = useAppSelector((state: RootState) => state.cards.tableCards)

    const modalRef = useRef<ModalHandle>(null)
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

    const selectedCard = useMemo(
        () => cards.find(c => c.id === selectedCardId),
        [cards, selectedCardId]
    )

    const handleOpenCard = useCallback((cardId: string) => {
        setSelectedCardId(cardId)
        modalRef.current?.open()
    }, [])

    const handleRemoveCard = useCallback((cardId: string) => {
        socket.emit("card:removeFromTable", {gameId, cardId})
    }, [gameId])

    return (
        <>
            <div className="flex flex-wrap gap-4 mt-6">
                {cards.map((card) => (
                    <div key={card.id} className="relative w-fit group">

                        {isHost && (
                            <MdOutlineRemoveCircle
                                className="absolute top-1 right-1 z-2 rounded-full text-white hover:text-orange-200 text-3xl cursor-pointer"
                                title={"Удалить"}
                                onClick={()=> handleRemoveCard(card.id)}
                            />
                        )}

                        <img
                            src={card.imageUrl}
                            alt="table card"
                            className="h-40 block cursor-pointer hover:scale-105 transition"
                            onClick={() => handleOpenCard(card.id)}
                        />
                    </div>
                ))}
            </div>

            <Modal ref={modalRef}>
                {selectedCard && (
                    <img
                        src={selectedCard.imageUrl}
                        alt="selected card"
                        className="max-h-[80vh] mx-auto"
                    />
                )}
            </Modal>
        </>
    )
}