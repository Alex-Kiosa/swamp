import {type Dispatch} from "@reduxjs/toolkit";
import api from "../../../api/axios.ts";
import {createGame, getGame} from "../model/game-reducer.ts";

export const createGameThunk = (data) => {
    return (dispatch: Dispatch) => {
        api.post("/game/create", {
            userId: data.userId,
            // chips: data.chips,
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
    return (dispatch: Dispatch) => {
        api.get("/game/active", {
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