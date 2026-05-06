import {deckConfig} from "../config/deckConfig"
import {DeckCard} from "./DeckCard"
import {DECK_TYPES} from "../card.types"
import type {Socket} from "socket.io-client";

type Props = {
    socket: Socket | null
}

export const DeckCards = ({socket} :Props) => {
    return (
        <div className="flex gap-4">
            {DECK_TYPES.map((type) => (
                <DeckCard
                    key={type}
                    type={type}
                    title={deckConfig[type].title}
                    cardBack={deckConfig[type].back}
                    socket={socket}
                />
            ))}
        </div>
    )
}