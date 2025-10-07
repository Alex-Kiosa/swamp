import {PasswordInput} from "../components/PasswordInput.tsx";
import {type ChangeEvent, useState} from "react";
import {validateEmail} from "../utils/helper.ts";

export const Login = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [password, setPassword] = useState("")

    const loginHandler = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Пожалуйста, укажите Email адрес без ошибок")
            return
        }

        if (!password) {
            setError("Пожалуйста, введите пароль")
            return
        }

        setError("")

        // Login API
    }

    return (
        <form onSubmit={loginHandler} method="POST"
              className="p-10 rounded-2xl space-y-6 bg-white">
            <div className="mb-5 text-center">
                <h2 className="mb-3 text-2xl font-bold">Войти в аккаунт</h2>
                <p>Еще нет аккаунта? <a href="#">Зарегистрируйтесь</a></p>
            </div>

            <div className="mb-5">
                <input
                    value={email}
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className="input-primary"
                    onChange={(e) => setEmail(e.currentTarget.value)}
                />

                {error && <p className="text-red-700 text-xs">{error}</p>}
            </div>
            <div className="mb-5">
                <PasswordInput
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
                />

                {error && <p className="text-red-700 text-xs">{error}</p>}
            </div>

            <div>
                <button type="submit"
                        className="btn-primary">Войти
                </button>
            </div>
        </form>
    )
}