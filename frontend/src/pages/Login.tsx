import {PasswordInput} from "../components/PasswordInput.tsx";
import * as React from "react";
import {type ChangeEvent, useState} from "react";
import {validateEmail} from "../lib/helper.ts";
import {Loader} from "../components/Loader.tsx";

export const Login = () => {
    const [email, setEmail] = useState("")
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPass, setErrorPass] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const changePassHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value)
        setErrorPass("")
    }

    const changeEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value)
        setErrorEmail("")
    }

    const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email && !password) {
            setErrorEmail("Пожалуйста, укажите email адрес в правильном формате")
            setErrorPass("Пожалуйста, введите пароль")
            return
        }

        if (!validateEmail(email)) {
            setErrorEmail("Пожалуйста, укажите email адрес в правильном формате")
            return
        }

        if (!password) {
            setErrorPass("Пожалуйста, введите пароль")
            return
        }

        setErrorEmail("")
        setErrorPass("")
        setLoading(true)

        // Login API
        fetch()
            .then((res)=> {
            setTimeout(()=> setLoading(false), 3000)
        })
    }

    return (
        <form onSubmit={loginHandler} method="POST" className="w-sm p-10 space-y-6 rounded-2xl bg-white shadow-sm" noValidate>
            <div className="mb-5 text-center">
                <h2 className="mb-3 text-2xl font-bold">Войти в аккаунт</h2>
                <p>Еще нет аккаунта? <a href="#" className="link link-primary">Зарегистрируйтесь</a></p>
            </div>

            <div className="mb-5">
                <label className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                    </svg>
                    <input
                        value={email}
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        className="input-primary"
                        onChange={changeEmailHandler}
                    />
                </label>

                {errorEmail && <div className="text-red-700 text-xs mt-2">{errorEmail}</div>}
            </div>
            <div className="mb-5">
                <PasswordInput
                    value={password}
                    onChange={changePassHandler}
                />

                {errorPass && <p className="text-red-700 text-xs mt-2">{errorPass}</p>}
            </div>

            <div>
                <button type="submit" className="btn btn-primary w-full text-base" disabled={loading}>{loading? <Loader/> : "Войти"}</button>
            </div>
        </form>
    )
}