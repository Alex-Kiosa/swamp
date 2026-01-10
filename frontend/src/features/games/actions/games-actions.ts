import api from "../../../api/axios.ts";
import {createChip, createGame, getChips, getGame} from "../model/game-reducer.ts";
import type {AppDispatch} from "../../../app/store.ts";

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
                console.log("Ошибка при создании игры", error.response.data);
            })
    }
}

export const getGameThunk = () => {
    return (dispatch: AppDispatch) => {
        api.get("/games/active", {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
            .then(res => {
                dispatch(getGame(res.data))
            })
            .catch(error => {
                console.log("Не удалось получить активную игру", error.response.data);
            })
    }
}

export const getChipsThunk = (gameId: string | null) => {
    return (dispatch: AppDispatch) => {
        api.get(`/games/${gameId}/chips`, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
            .then(res => {
                dispatch(getChips(res.data))
            })
            .catch(error => {
                console.log("Не удалось получить фишки", error.response.data);
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
                console.log("Ошибка при добавлении фишки", error.response.data);
            })
    }
}