import axios from "axios";
import {setUser} from "../model/user-reducer.ts";
import {type Dispatch} from "@reduxjs/toolkit";
import api from "../../../api/axios.ts";

export const registration = async (name: string, email: string, password: string) => {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/registration", {
            name,
            email,
            password
        })
        console.log(response.data.message)
    } catch (error) {
        console.log(error.response.data.message)
    }
}

export const loginThunk = (email: string, password: string) => {
    return async (dispatch:Dispatch) => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            })
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
            console.log(response.data)
        } catch (error) {
            console.log(error.response.data.message)
        }
    }
}

export const authThunk = () => {
    return (dispatch: Dispatch) => {
        api.get("/auth/auth", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                dispatch((setUser(res.data.user)))
            })
            .catch(error => {
                console.log("Токен невалидный или истёк", error);
                localStorage.removeItem("token");
            })
    }
}