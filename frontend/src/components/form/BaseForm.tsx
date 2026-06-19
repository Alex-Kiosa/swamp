import {Loading} from "../loading/Loading.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {Privacy} from "../privacy/Privacy.tsx";
import {useAppSelector} from "../../common/hooks/hooks.ts";
import {selectAppStatus} from "../../app/appSelectors.ts";

export type FormDataFields = Record<string, string>

type FormType = {
    title?: string
    submitText?: string
    onSubmit: (data: FormDataFields) => void
    classNames?: string
    children?: React.ReactNode
}

export const BaseForm = ({
                         title,
                         onSubmit,
                         submitText = "Сохранить",
                         classNames,
                         children,
                     }: FormType) => {

    const status = useAppSelector(selectAppStatus)
    const methods = useForm()

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className={`mx-auto rounded-2xl ${classNames}`}
            >
                {title && (
                    <div className="text-center mb-5">
                        <h2 className="text-2xl font-bold">{title}</h2>
                    </div>
                )}

                {children}

                <button
                    type="submit"
                    className="w-full mt-2 btn btn-primary text-base"
                    disabled={status === "loading"}
                >
                    {status === "loading" ? <Loading/> : submitText}
                </button>

                <div className={"mt-4"}><Privacy/></div>
            </form>
        </FormProvider>
    )
}