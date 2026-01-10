import {type FieldValues, type RegisterOptions, useFormContext} from "react-hook-form"
import {AnimatePresence} from "framer-motion"
import {findInputError} from "../../common/utils/findInputError.ts"
import {isFormInvalid} from "../../common/utils/isFormInvalid.ts"
import {InputError} from "../input/Input.tsx";

export type SelectOption = {
    label: string
    value: string | number
}

export type SelectType = {
    legend?: string
    label?: string
    id: string
    placeholder?: string
    options: SelectOption[]
    validation?: RegisterOptions<FieldValues, string>
}


export const Select = ({
                           legend,
                           label,
                           id,
                           placeholder,
                           options,
                           validation,
                       }: SelectType) => {
    const {register, formState: {errors}} = useFormContext()

    const inputError = findInputError(errors, id)
    const isInvalid = isFormInvalid(inputError)

    return (
        <div className="mb-5">
            {legend && <legend className="fieldset-legend">{legend}</legend>}

            <select
                id={id}
                defaultValue=""
                className="select"
                // регистрируем поле формы через useFormContext
                {...register(id, validation)}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {label && <span className="label">{label}</span>}

            <AnimatePresence mode="wait" initial={false}>
                {isInvalid && "error" in inputError && (
                    <InputError message={inputError.error.message}/>
                )}
            </AnimatePresence>
        </div>
    )
}