import type {DeckType} from "../card.types.ts";

export const deckConfig: Record<
    DeckType,
    { title: string; back: string }
> = {
    plants: {
        title: "Растения",
        back: "/cards-backs/plants.jpg",
    },
    animals: {
        title: "Животные",
        back: "/cards-backs/animals.jpg",
    },
    wisdom: {
        title: "Мудрые подсказки",
        back: "/cards-backs/wisdom.jpg",
    },
    creatures: {
        title: "Сказочные существа",
        back: "/cards-backs/creatures.jpg",
    },
    mac: {
        title: "МАК подсказки",
        back: "/cards-backs/mac.jpg",
    },
    swamp: {
        title: "Болото",
        back: "/cards-backs/swamp.jpg",
    },
}
