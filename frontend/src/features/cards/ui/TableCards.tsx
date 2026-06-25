import {useMemo, useRef, useState, useCallback} from "react"
import {useAppSelector} from "../../../common/hooks/hooks"
import type {RootState} from "../../../app/store"
import {Modal, type ModalHandle} from "../../../pages/Game/modal/Modal"
import {MdOutlineRemoveCircle, MdFullscreen} from "react-icons/md"
import type {Socket} from "socket.io-client"
import {getImageUrl} from "../../../common/utils/getImageUrl.ts"

type Props = {
    isHost: boolean
    gameId: string
    socket: Socket | null
}

// TODO: задизейблил иконку удаления до прихода card:removedFromTable

export const TableCards = ({isHost, gameId, socket}: Props) => {
    const cards = useAppSelector(
        (state: RootState) => state.cards.tableCards
    )

    const cardModalRef = useRef<ModalHandle>(null)
    const tableModalRef = useRef<ModalHandle>(null)

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

    const selectedCard = useMemo(
        () => cards.find(card => card.id === selectedCardId),
        [cards, selectedCardId]
    )

    const previewCards = cards.slice(0, 4)

    const handleOpenCard = useCallback((cardId: string) => {
        setSelectedCardId(cardId)
        cardModalRef.current?.open()
    }, [])

    const handleRemoveCard = useCallback((cardId: string) => {
        if (!socket) return

        socket.emit("card:removeFromTable", {
            gameId,
            cardId
        })
    }, [gameId, socket])

    const renderPreviewCard = (card: typeof cards[number]) => (
        <div key={card.id} className="relative h-full w-full">
            {isHost && (
                <MdOutlineRemoveCircle
                    className="absolute top-1 right-1 z-10 rounded-full text-white hover:text-orange-200 text-3xl cursor-pointer"
                    title="Удалить"
                    onClick={() => handleRemoveCard(card.id)}
                />
            )}

            <img
                src={getImageUrl(card.imageUrl)}
                alt="table card"
                className="w-full h-full object-cover object-top rounded-md cursor-pointer hover:scale-105 transition"
                title="Увеличить"
                onClick={() => handleOpenCard(card.id)}
            />
        </div>
    )

    const renderModalCard = (card: typeof cards[number]) => (
        <div key={card.id} className="relative">
            {isHost && (
                <MdOutlineRemoveCircle
                    className="absolute top-1 right-1 z-10 rounded-full text-white hover:text-orange-200 text-3xl cursor-pointer"
                    title="Удалить"
                    onClick={() => handleRemoveCard(card.id)}
                />
            )}

            <img
                src={getImageUrl(card.imageUrl)}
                alt="table card"
                className="w-full h-auto rounded-md cursor-pointer hover:scale-105 transition"
                title="Увеличить"
                onClick={() => handleOpenCard(card.id)}
            />
        </div>
    )

    return (
        <>
            <div className="absolute right-[3%] bottom-[4%] w-[34%] h-[42%]">
                <div className="relative h-full bg-base-100/90 rounded-lg p-2">

                    <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-sm">
                            Карты на столе ({cards.length})
                        </div>

                        <button
                            className="btn btn-xs btn-ghost"
                            title="Развернуть"
                            onClick={() => tableModalRef.current?.open()}
                        >
                            <MdFullscreen size={24}/>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[calc(100%-32px)]">
                        {previewCards.map(renderPreviewCard)}

                        {cards.length > 4 && (
                            <button
                                className="rounded-md border border-base-300 bg-base-200 hover:bg-base-300 hover:cursor-pointer flex items-center justify-center text-xl font-bold"
                                onClick={() => tableModalRef.current?.open()}
                            >
                                +{cards.length - 4}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                ref={tableModalRef}
                classNames={"max-w-8/10 overflow-y-auto"}
                width={"80-vw"}
            >
                    <div className="text-2xl font-bold mb-6 text-center">
                        Карты на столе
                    </div>

                    <div className="grid grid-cols-5 gap-4 items-start">
                        {cards.map(renderModalCard)}
                    </div>
            </Modal>

            <Modal ref={cardModalRef}>
                {selectedCard && (
                    <img
                        src={getImageUrl(selectedCard.imageUrl)}
                        alt="selected card"
                        className="max-h-[80vh] mx-auto rounded-md"
                    />
                )}
            </Modal>
        </>
    )
}