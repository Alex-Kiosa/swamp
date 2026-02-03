import {Loading} from "../loading/Loading.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {Privacy} from "../privacy/Privacy.tsx";
import {useAppSelector} from "../../common/hooks/hooks.ts";
import {selectAppStatus} from "../../app/appSelectors.ts";

type FormType = {
    title?: string
    submitText?: string
    onSubmit: (data: any) => void
    children?: React.ReactNode
}

export const Form = ({
                         title,
                         onSubmit,
                         submitText = "Сохранить",
                         children,
                     }: FormType) => {

    const status = useAppSelector(selectAppStatus)
    const methods = useForm()

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="mx-auto w-xs rounded-2xl"
            >
                {title && (
                    <div className="text-center">
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