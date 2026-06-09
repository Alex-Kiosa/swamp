import api from "../../../api/axios.ts";

export const getSocketToken = async (gameId: string) => {
    const authToken = localStorage.getItem("token");
    const playerId = localStorage.getItem("playerId");
    const headers: Record<string, string> = {}

    if (authToken) {
        headers["Authorization"] = "Bearer " + authToken;
    }

    if (playerId) {
        headers["player-id"] = playerId;
    }

    const res = await api.get(`/games/${gameId}/socket-token`, {headers})

    return res.data.socketToken
}