import api from "../../../../api/axios.ts";

export const getVideoToken = async (
    gameId: string,
    participantName: string
) => {
    const response = await api.get("/video/token", {
        params: {
            gameId,
            participantName
        }
    })

    return response.data.token
}