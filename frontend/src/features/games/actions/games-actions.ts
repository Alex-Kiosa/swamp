import api from "../../../api/axios.ts";
import {
    createGame,
    deleteChipsByGame,
    deleteGame,
    getChips, getGameFailed, getGameNotFound,
    getGamePending,
    getGameSuccess
} from "../model/gameSlice.ts";
import type {AppDispatch} from "../../../app/store.ts";
import {setAppError} from "../../../app/app-reducer.ts";

export const createGameThunk = () => {
    return (dispatch: AppDispatch) => {
        api.post("/games", {}, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
            .then(res => {
                dispatch((createGame(res.data.game)))
                // localStorage.setItem("socketToken", res.data.socketToken)
            })
            .catch(error => {
                dispatch(setAppError(error.response.data.message))
                console.log("Ошибка при создании игры", error.response.data)
            })
    }
}

export const getGameThunk = (gameId: string) => {
    return async (dispatch: AppDispatch) => {
        const authToken = localStorage.getItem("token")
        const socketToken = localStorage.getItem("socketToken")

        try {
            // ⏳ старт загрузки
            dispatch(getGamePending())

            const gameRes = await api.get(`/games/${gameId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            dispatch(getGameSuccess(gameRes.data))

            // Получаем socketToken для ведущего
            if (gameRes.data.isHost && !socketToken) {
                const socketRes = await api.get(
                    `/games/${gameId}/socket-token`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        }
                    }
                )

                localStorage.setItem("socketToken", socketRes.data.socketToken)
            }

            const chipsRes = await api.get(
                `/games/${gameRes.data.gameId}/chips`,
                {
                    headers: { Authorization: `Bearer ${authToken}` }
                }
            )

            dispatch(getChips(chipsRes.data))

        } catch (error: any) {
            const status = error.response?.status

            if (status === 404) {
                dispatch(getGameNotFound())
                return
            }

            dispatch(getGameFailed())
            dispatch(setAppError(error.response?.data?.message || "Failed to load game"))

            console.log("Ошибка при инициализации игры", error)
        }
    }
}

// TODO: протестировать получение игры с несколькими юзерами
export const getGameByUserThunk = () => {
    return async (dispatch: AppDispatch) => {
        const token = localStorage.getItem("token")

        try {
            dispatch(getGamePending())

            const gameRes = await api.get(`/games/active`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            dispatch(getGameSuccess(gameRes.data))

            const chipsRes = await api.get(
                `/games/${gameRes.data.gameId}/chips`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            dispatch(getChips(chipsRes.data))

        } catch (error: any) {
            const status = error.response?.status

            if (status === 404) {
                dispatch(getGameNotFound())
                return
            }

            dispatch(getGameFailed())
            dispatch(setAppError(error.response?.data?.message || "Ошибка при инициализации игры"))

            console.log("Ошибка при инициализации игры", error)
        }
    }
}

export const deleteGameThunk = (gameId: string) => {
    return (dispatch: AppDispatch) => {
        api.delete(`/games/${gameId}`, {
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        })
            .then(res => {
                dispatch(deleteGame(res.data))
            })
            .catch(error => {
                dispatch(setAppError(error.response?.data?.message))
                console.log("Ошибка при удалении игры", error)
            })
    }
}

export const createChipThunk = (chip: {
    gameId: string,
    color: string,
    shape: string
}) => {
    return (dispatch: AppDispatch) => {
        api.post(`/games/${chip.gameId}/chips`,
            {
                color: chip.color,
                shape: chip.shape
            },
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            .catch(error => {
                dispatch(setAppError(error.response.data.message))
                console.log("Ошибка при добавлении фишки", error.response.data);
            })
    }
}

export const moveChipThunk = (
    chipId: string,
    position: { x: number, y: number }
) => {
    return (dispatch: AppDispatch) => {
        api.patch(`/chips/${chipId}`,
            {position})
            .catch(error => {
                dispatch(setAppError(error.response.data.message))
                console.log("Ошибка при перемещении фишки", error.response.data);
            })
    }
}

export const deleteChipsByGameThunk = (gameId: string) => {
    return (dispatch: AppDispatch) => {
        api.delete(`/games/${gameId}/chips`, {
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        })
            .then(res => {
                dispatch(deleteChipsByGame(res.data))
            })
            .catch(error => {
                dispatch(setAppError(error.response?.data?.message))
                console.log("Ошибка при удалении фишек игры", error)
            })
    }
}

export const joinGameThunk = (gameId: string, playerName: string) => {
    return (dispatch: AppDispatch) => {
        api.post(`/games/${gameId}/join`, {
            name: playerName,
        })
            .then(res => {
                dispatch(getGameThunk(gameId))
                localStorage.setItem("socketToken", res.data.socketToken)
            })
            .catch(error => {
                dispatch(setAppError(error.response.data.message))
                console.log("Ошибка при подключении к игре ", error.response.data)
            })
    }
}