import {useState} from "react";
import {Input} from "../components/input/Input.tsx";
import {useAppDispatch} from "../common/hooks/hooks.ts";
import {BaseForm, type FormDataFields} from "../components/form/BaseForm.tsx";
import {forgotPasswordThunk} from "../features/users/actions/user-actions.ts";
import {email_validation} from "../common/utils/inputValidations.ts";
import {Alert} from "../components/alert/Alert.tsx";

export const ForgotPassword = () => {
    const dispatch = useAppDispatch()

    const [success, setSuccess] = useState(false)

    const onSubmit = async (data: FormDataFields) => {
        await dispatch(
            forgotPasswordThunk(data["input-email"])
        )

        setSuccess(true)
    }

    if (success) {
        return (
            <div className="w-sm p-10 rounded-2xl bg-white shadow-sm">
                <Alert
                    type="success"
                    message="Если указанный Email зарегистрирован, ссылка для восстановления пароля отправлена на вашу почту."
                />
            </div>
        )
    }

    return (
        <BaseForm
            title="Восстановление пароля"
            submitText="Получить ссылку"
            onSubmit={onSubmit}
            classNames={"w-sm p-10 space-y-6 bg-white shadow-sm"}
        >
            <Input
                {...email_validation}
                placeholder="Введите Ваш email"
            />
        </BaseForm>
    )
}