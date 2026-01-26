import {Loading} from "../components/loading/Loading.tsx";
import {Link, useNavigate} from "react-router"
import {Input} from "../components/input/Input.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {GrMail} from "react-icons/gr";
import {email_validation, name_validation, pass_validation} from "../common/utils/inputValidations.ts";
import {regThunk} from "../features/users/actions/user-actions.ts";
import {Privacy} from "../components/privacy/Privacy.tsx";
import {useAppDispatch, useAppSelector} from "../common/hooks/hooks.ts";
import {selectAppStatus} from "../app/appSelectors.ts";

export const Signup = () => {
    const methods = useForm()
    const status = useAppSelector(selectAppStatus)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const onSubmit = methods.handleSubmit(async (data) => {
        try {
            await dispatch(
                regThunk(
                    data["input-name"],
                    data["input-email"],
                    data["input-password"]
                )
            )

            // редирект, если promise, который вернул dispatch, зарезолвился
            navigate("/login",{
                replace: true,
                state: {fromRegistration: true}
            })
        } catch (error) {
            // если ошибка — редиректа не будет
            console.log("Registration failed")
        }
    })

    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit} noValidate className="w-sm p-10 space-y-6 rounded-2xl bg-white shadow-sm">
                <div className="mb-5 text-center">
                    <h2 className="mb-3 text-2xl font-bold">Зарегистрироваться как ведущий</h2>
                    <p>Уже есть аккаунт? <Link to="/login" className="link link-primary">Войти</Link></p>
                </div>

                <Input {...name_validation}/>
                <Input {...email_validation}/>
                <Input {...pass_validation} placeholder="пароль от 6 до 15 символов"/>

                <button
                    type="submit"
                    className="w-full mt-2 btn btn-primary text-base"
                    disabled={status === "loading"}
                >
                    <GrMail/>
                    {status === "loading" ? <Loading/> : "Зарегистрироваться"}
                </button>

                <Privacy/>
            </form>
        </FormProvider>
    )
}