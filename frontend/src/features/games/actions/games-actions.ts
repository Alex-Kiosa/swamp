import api from "../../../api/axios.ts";
import {createChip, createGame, deleteChipsByGame, deleteGame, getChips, getGame} from "../model/game-reducer.ts";
import type {AppDispatch} from "../../../app/store.ts";
import {setAppError} from "../../../app/app-reducer.ts";

export const createGameThunk = () => {
    return (dispatch: AppDispatch) => {
        api.post("/games", {}, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
            .then(res => {
                dispatch((createGame(res.data)))
                localStorage.setItem("socketToken", res.data.socketToken)
            })
            .catch(error => {
                dispatch(setAppError(error.response.data.message))
                console.log("Ошибка при создании игры", error.response.data)
            })
    }
}

export const getGameThunk = (gameId: string) => {
    const authToken =
        localStorage.getItem("token") ||
        localStorage.getItem("guestToken")

    return (dispatch: AppDispatch) => {
        api.get(`/games/${gameId}`,
            {
                headers: {Authorization: `Bearer ${authToken}`}
            })
            .then(gameRes => {
                dispatch(getGame(gameRes.data))

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

// TODO: протестировать получение игры с несколькими юзерами
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
            // TODO: убрать, когда реализую обновления UI у всех игроков через сокеты
            .then(chipsRes => {
                dispatch(getChips(chipsRes.data))
            })
            .catch(error => {
                dispatch(setAppError(error.response?.data?.message))
                console.log("Ошибка при инициализации игры", error)
            })
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
            // .then(res => {
            //     dispatch(createChip(res.data))
            // })
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