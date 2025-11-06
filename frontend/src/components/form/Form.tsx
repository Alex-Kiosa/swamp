import {useState} from "react";
import {Loader} from "../loader/Loader.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {Input} from "../input/Input.tsx";
import {email_validation, pass_validation} from "../../common/utils/inputValidations.ts";
import {Privacy} from "../privacy/Privacy.tsx";

export const Form = () => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const methods = useForm()

    const onSubmit = methods.handleSubmit(data => {
        console.log(true)
    })

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={(e) => e.preventDefault()}
                noValidate
                className="w-sm p-10 space-y-6 rounded-2xl bg-white shadow-sm"
            >
                <div className="mb-5 text-center">
                    <h2 className="mb-3 text-2xl font-bold">Форма стандартная</h2>
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