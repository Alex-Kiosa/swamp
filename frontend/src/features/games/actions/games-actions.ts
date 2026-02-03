import api from "../../../api/axios.ts";
import {createChip, createGame, deleteChipsByGame, getChips, getGame} from "../model/game-reducer.ts";
import type {AppDispatch} from "../../../app/store.ts";
import {setAppError} from "../../../app/app-reducer.ts";

export const createGameThunk = (data) => {
    return (dispatch: AppDispatch) => {
        api.post("/games", {
            userId: data.userId,
        }, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
            .then(res => {
                dispatch((createGame(res.data)))
            })
            .catch(error => {
                dispatch(setAppError(error.response.data.message))
                console.log("Ошибка при создании игры", error.response.data)
            })
    }
}

export const getGameThunk = (gameId: string) => {
    return (dispatch: AppDispatch) => {
        api.get(`/games/${gameId}`)
            .then(gameRes => {
                dispatch(getGame(gameRes.data))

                const authToken =
                    localStorage.getItem("token") ||
                    localStorage.getItem("guestToken")

                // ВАЖНО: возвращаем promise
                return api.get(
                    `/games/${gameRes.data.gameId}/chips`,
                    {
                        headers: {Authorization: `Bearer ${authToken}`}
                    }
                )
            })
            .then(chipsRes => {
                dispatch(getChips(chipsRes.data))
            })
            .catch(error => {
                dispatch(setAppError(error.response?.data?.message))
                console.log("Ошибка при инициализации игры", error)
            })
    }
}

// протестировать получение игры с несколькими юзерами
export const getGameByUserThunk = () => {
    return (dispatch: AppDispatch) => {
        api.get(`/games/active`, {
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        })
            .then(gameRes => {
                dispatch(getGame(gameRes.data))

                // ВАЖНО: возвращаем promise
                return api.get(
                    `/games/${gameRes.data.gameId}/chips`,
                    {
                        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                    }
                )
            })
            .then(chipsRes => {
                dispatch(getChips(chipsRes.data))
            })
            .catch(error => {
                dispatch(setAppError(error.response?.data?.message))
                console.log("Ошибка при инициализации игры", error)
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
            .then(res => {
                dispatch(createChip(res.data))

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
            {position},
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
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
                console.log("try to delete chips")
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
                localStorage.setItem("guestToken", res.data.guestToken)
            })
            .catch(error => {
                dispatch(setAppError(error.response.data.message))
                console.log("Ошибка при подключении к игре ", error.response.data)
            })
    }
}