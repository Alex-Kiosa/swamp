import {useNavigate, useSearchParams} from "react-router";
import { resetPasswordThunk } from "../features/users/actions/user-actions.ts"
import { BaseForm, type FormDataFields } from "../components/form/BaseForm.tsx"
import { useAppDispatch } from "../common/hooks/hooks.ts"
import { pass_validation } from "../common/utils/inputValidations.ts"
import { Input } from "../components/input/Input.tsx"

export const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    if (!token) {
        return (
            <div className="alert alert-error">
                Ссылка для восстановления пароля недействительна или устарела.
            </div>
        )
    }

    const onSubmit = async (data: FormDataFields) => {
        if (!token) {
            return
        }

        try {
            await dispatch(
                resetPasswordThunk(
                    token,
                    data["input-password"]
                )
            )

            navigate("/login", {
                state: {
                    passwordResetSuccess: true
                }
            })
        } catch (error) {
            // ошибка уже обработана в thunk через setAppError
        }
    }

    return (
        <BaseForm
            title="Создать новый пароль"
            submitText="Сохранить пароль"
            onSubmit={onSubmit}
            classNames={"p-10 space-y-6 bg-white shadow-sm w-sm"}
        >
            <Input {...pass_validation} />
        </BaseForm>
    )
}