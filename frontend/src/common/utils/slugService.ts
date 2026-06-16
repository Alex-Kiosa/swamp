const slugToTileDictionary : Record<string, string> = {
    "signup": "Зарегистрироваться",
    "login": "Войти",
    "account": "Аккаунт",
    "create-game": "Создать игру",
    "forgot-password": "Восстановление пароля",
    "reset-password": "Создать новый пароль",
}

export const convertSlugTotTile = (slug:string): string => {
    return slugToTileDictionary[slug] ||
        slug.replace("-", " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}