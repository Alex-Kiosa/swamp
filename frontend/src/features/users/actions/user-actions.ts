import {setIsInitialized, setUser} from "../model/user-reducer.ts";
import api from "../../../api/axios.ts";
import {setAppError, setAppStatus} from "../../../app/app-reducer.ts";
import type {AppDispatch} from "../../../app/store.ts";
import {errorMessages} from "../../../common/utils/errorMessages.ts";

export const regThunk = (name: string, email: string, password: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setAppStatus("loading"))

            const response = await api.post("/auth/registration", {
                name,
                email,
                password
            })

            dispatch(setAppError(null))
            dispatch(setAppStatus("succeeded"))
        } catch (error: any) {
            dispatch(setAppStatus("failed"))
            dispatch(setAppError(error.response.data.message))
            // пробрасываем ошибку дальше, чтобы прервать редирект, если promise перешел в состояние rejected
            // поскольку dispacth() по умолчанию всегда возвращает promise с состоянием fulfilled
            throw error
        }
    }
}

export const loginThunk = (email: string, password: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            const response = await api.post("/auth/login", {
                email,
                password
            })
            dispatch(setAppError(null))
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
        } catch (error: any) {
            dispatch(setAppError("Неверный Email или пароль"))
        }
    }
}

export const authThunk = () => {
    return (dispatch: AppDispatch) => {
        dispatch(setAppStatus("loading"))
        api.get("/auth/auth", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                dispatch(setAppStatus("succeeded"))
                dispatch((setUser(res.data.user)))
            })
            .catch(error => {
                dispatch(setAppStatus("failed"))
                console.log(error.response.data.message)
                localStorage.removeItem("token");
            })
            .finally(() => {
                dispatch(setIsInitialized(true))
            })
    }
}

export const forgotPasswordThunk = (email: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setAppStatus("loading"))

            await api.post("/auth/forgot-password", {
                email
            })

            dispatch(setAppStatus("succeeded"))
            dispatch(setAppError(null))
        } catch (error: any) {
            dispatch(setAppStatus("failed"))
            dispatch(setAppError(
                error.response?.data?.message ||
                "Ошибка восстановления пароля"
            ))
            throw error
        }
    }
}

export const resetPasswordThunk = (
    token: string,
    password: string
) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setAppStatus("loading"))

            await api.post("/auth/reset-password", {
                token,
                password,
            })

            dispatch(setAppStatus("succeeded"))
            dispatch(setAppError(null))
        } catch (error: any) {
            dispatch(setAppStatus("failed"))

            const code = error.response?.data?.code

            dispatch(
                setAppError(
                    errorMessages[code] ||
                    error.response?.data?.message ||
                    "Не удалось изменить пароль"
                )
            )

            throw error
        }
    }
}