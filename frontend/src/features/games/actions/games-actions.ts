import {type Dispatch} from "@reduxjs/toolkit";
import api from "../../../api/axios.ts";
import {createGame} from "../model/game-reducer.ts";

export const gameCreateThunk = () => {
    return (dispatch: Dispatch) => {
        api.post("/game/create", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                dispatch((createGame(res.data.user)))
            })
            .catch(error => {
                console.log("Ошибка при создании игры", error);
            })
    }
}