import { socket } from "../../../socket.ts"
import { useParams } from "react-router"
import { useAppSelector } from "../../../common/hooks/hooks.ts"
import type { CardCategoryType } from "../card.types.ts"
import type { RootState } from "../../../app/store.ts"

type Props = {
    type: CardCategoryType
    title: string
    cardBack: string
}

export const DeckCard = ({ type, title, cardBack }: Props) => {
    const { gameId } = useParams<{ gameId: string }>()

    const card = useAppSelector(
        (state: RootState) => state.cards.openedCards[type]
    )

    const isEmpty = useAppSelector(
        (state: RootState) => state.cards.deckEmpty[type]
    )

    const drawCard = () => {
        if (!gameId) return
        socket.emit("card:draw", { gameId, type })
    }

    return (
        <div className="h-full flex flex-col items-center justify-start rounded-xl overflow-hidden shadow-lg">
            <img
                src={cardBack}
                alt={title}
                className="h-full w-auto object-contain cursor-pointer"
                onClick={drawCard}
            />
            {isEmpty && (
                <div className="text-red-500 text-sm mt-2">
                    Колода пуста
                </div>
            )}

            {card && (
                <div className="mt-2 p-2 bg-gray-100 rounded">
                    {card}
                </div>
            )}
        </div>
    )
}
