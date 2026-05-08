const API_URL = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, "")

export function getImageUrl(path?: string) {
    if (!path) return ""

    if (path.startsWith("http")) {
        return path
    }

    return `${API_URL}${path}`
}