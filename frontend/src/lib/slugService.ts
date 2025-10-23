const slugToTileDictionary = {
    "signup": "Зарегистрироваться",
    "login": "Войти"
}

export const convertSlugTotTile = (slug) => {
    return slugToTileDictionary[slug] ||
        slug.replace("-", " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}