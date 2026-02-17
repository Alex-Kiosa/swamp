// services/deckService.js
import fs from "fs/promises"
import path from "path"

// TODO: Изучить алгоритм Fisher–Yates
// Fisher–Yates сортировка
function shuffle(array) {
    const shuffled = [...array]

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
}

export async function generateDeck(cardType) {
    const dirPath = path.join(process.cwd(), "public", "cards", cardType)

    const files = await fs.readdir(dirPath)

    const images = files.map(file =>
        `/static/cards/${cardType}/${file}`
    )

    return shuffle(images)
}
