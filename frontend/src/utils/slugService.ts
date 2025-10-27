const slugToTileDictionary : Record<string, string> = {
    "signup": "Зарегистрироваться",
    "login": "Войти"
}

export const convertSlugTotTile = (slug:string): string => {
    return slugToTileDictionary[slug] ||
        slug.replace("-", " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}