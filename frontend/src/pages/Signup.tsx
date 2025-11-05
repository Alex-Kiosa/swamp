import {Loader} from "../components/loader/Loader.tsx";
import {useState} from "react";
import {Link} from "react-router"
import {Input} from "../components/input/Input.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {GrMail} from "react-icons/gr";
import {email_validation, name_validation, pass_validation} from "../common/utils/inputValidations.ts";
import {registration} from "../features/users/actions/user.ts";
import {Privacy} from "../components/privacy/Privacy.tsx";

export const Signup = () => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const methods = useForm()

    const onSubmit = methods.handleSubmit(data => {
        registration(data["input-name"], data["input-email"], data["input-password"])
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
                    <h2 className="mb-3 text-2xl font-bold">Зарегистрироваться как ведущий</h2>
                    <p>Уже есть аккаунт? <Link to="/login" className="link link-primary">Войти</Link></p>
                </div>

                <Input {...name_validation}/>
                <Input {...email_validation}/>
                <Input
                    {...pass_validation}
                    placeholder="пароль от 6 до 15 символов"
                    validation={{
                        ...pass_validation.validation,
                        minLength: { value: 6, message: "Пароль должен содержать от 6 до 15 символов" },
                        maxLength: { value: 15, message: "Пароль должен содержать от 6 до 15 символов" },
                    }}
                />

                <button
                    type="submit"
                    onClick={onSubmit}
                    className="btn btn-primary w-full text-base"
                    disabled={loading}
                >
                    <GrMail/>
                    {loading ? <Loader/> : "Зарегистрироваться"}
                </button>

                <Privacy/>
            </form>
        </FormProvider>
    );
}