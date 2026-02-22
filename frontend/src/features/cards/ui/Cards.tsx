import { deckConfig } from "../config/deckConfig"
import { DeckCard } from "./DeckCard"
import { DECK_TYPES } from "../card.types"

export const Cards = () => {
    return (
        <div className="flex gap-4">
            {DECK_TYPES.map((type) => (
                <DeckCard
                    key={type}
                    type={type}
                    title={deckConfig[type].title}
                    cardBack={deckConfig[type].back}
                />
            ))}
        </div>
    )
}