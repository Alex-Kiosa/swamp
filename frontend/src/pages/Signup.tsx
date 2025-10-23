import {PasswordInput} from "../components/PasswordInput.tsx";
import {Loader} from "../components/loader/Loader.tsx";
import {type ChangeEvent, useState} from "react";
import {Input} from "../components/input/Input.tsx";
import {Link} from "react-router"

export const Signup = () => {
    const [name, setName] = useState("")
    const [errorName, setErrorName] = useState("")
    const [email, setEmail] = useState("")
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPass, setErrorPass] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    function changeNameHandler(e: ChangeEvent<HTMLInputElement>) {
        setName(e.currentTarget.value)
        setErrorName("")
    }

    function changeEmailHandler(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.currentTarget.value)
        setErrorEmail("")
    }

    function changePassHandler(e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.currentTarget.value)
        setErrorPass("")
    }

    function signUpHandler() {

    }

    return (
        <form onSubmit={signUpHandler} method="POST" className="w-sm p-10 space-y-6 rounded-2xl bg-white shadow-sm"
              noValidate>
            <div className="mb-5 text-center">
                <h2 className="mb-3 text-2xl font-bold">Зарегистрироваться как ведущий</h2>
                <p>Уже есть аккунт? <Link to="/login" className="link link-primary">Войти</Link></p>
            </div>

            <Input
                type={"text"}
                value={name}
                setValue={setName}
                placeholder={"Имя"}
                autoComplete="name"
                className="input-primary"
                error={errorName}
            />
            <Input
                type={"email"}
                value={email}
                setValue={setEmail}
                placeholder={"Email"}
                autoComplete="name"
                className="input-primary"
                error={errorEmail}
            />

            <div className="mb-5">
                <PasswordInput
                    value={password}
                    onChange={changePassHandler}
                />

                {errorPass && <p className="text-red-700 text-xs mt-2">{errorPass}</p>}
            </div>

            <div>
                <button type="submit" className="btn btn-primary w-full text-base" disabled={loading}>{loading ?
                    <Loader/> : "Зарегистрироваться"}</button>
            </div>
        </form>
    )
}