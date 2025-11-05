import * as React from "react";
import {useState} from "react";
import {Loader} from "../components/loader/Loader.tsx";
import {Link} from "react-router"
import {FormProvider, useForm} from "react-hook-form";
import {loginThunk} from "../features/users/actions/user.ts";
import {Input} from "../components/input/Input.tsx";
import {email_validation, pass_validation} from "../common/utils/inputValidations.ts";
import {Privacy} from "../components/privacy/Privacy.tsx";
import {useDispatch} from "react-redux";

export const Login = () => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const methods = useForm()
    const dispatch = useDispatch()

    const onSubmit = methods.handleSubmit(data => {
        dispatch(loginThunk(data["input-email"], data["input-password"]))
        // methods.reset()
        setSuccess(true)
    })

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={(e) => e.preventDefault()}
                noValidate
                className="w-sm p-10 space-y-6 rounded-2xl bg-white shadow-sm"
            >
                <div className="mb-5 text-center">
                    <h2 className="mb-3 text-2xl font-bold">Войти</h2>
                    <p>Еще нет аккаунта? <Link to="/signup" className="link link-primary">Зарегистрироваться</Link>
                    </p>
                </div>

                <Input {...email_validation} placeholder="Введите email"/>
                <Input {...pass_validation}/>

                <button
                    type="submit"
                    onClick={onSubmit}
                    className="btn btn-primary w-full text-base"
                    disabled={loading}
                >

                    {loading ? <Loader/> : "Войти"}
                </button>

                <Privacy/>
            </form>
        </FormProvider>
    );
}