import {Loader} from "../components/loader/Loader.tsx";
import {useState} from "react";
import {Link} from "react-router"
import {Input} from "../components/input/Input.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {GrMail} from "react-icons/gr";
import {email_validation, name_validation, pass_validation} from "../utils/inputValidations.ts";
import {Alert} from "../components/alert/Alert.tsx";
import {registration} from "../actions/user.ts";

export const Signup = () => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    //     // Login API
    //     // fetch()
    //     //     .then((res)=> {
    //     //         setTimeout(()=> setLoading(false), 3000)
    //     //     })
    //     registration(name, email, password)
    // }

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
                <Input {...pass_validation}/>

                <button
                    type="submit"
                    onClick={onSubmit}
                    className="btn btn-primary w-full text-base"
                    disabled={loading}
                >
                    <GrMail/>
                    {loading ? <Loader/> : "Зарегистрироваться"}
                </button>
            </form>
        </FormProvider>
    );
}