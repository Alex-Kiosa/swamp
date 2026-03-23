import type {DeckType} from "../card.types.ts";

export const deckConfig: Record<
    DeckType,
    { title: string; back: string }
> = {
    plants: {
        title: "Растения",
        back: "/uploads/cards-backs/plants.jpg",
    },
    animals: {
        title: "Животные",
        back: "/uploads/cards-backs/animals.jpg",
    },
    wisdom: {
        title: "Мудрые подсказки",
        back: "/uploads/cards-backs/wisdom.jpg",
    },
    creatures: {
        title: "Сказочные существа",
        back: "/uploads/cards-backs/creatures.jpg",
    },
    mac: {
        title: "МАК подсказки",
        back: "/uploads/cards-backs/mac.jpg",
    },
    swamp: {
        title: "Болото",
        back: "/uploads/cards-backs/swamp.jpg",
    },
}
