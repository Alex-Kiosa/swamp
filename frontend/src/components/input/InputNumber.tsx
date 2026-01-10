import cn from 'classnames'
import {findInputError} from '../../common/utils/findInputError.ts'
import {isFormInvalid} from '../../common/utils/isFormInvalid.ts'
import {type FieldValues, type RegisterOptions, useFormContext} from 'react-hook-form'
import {AnimatePresence} from 'framer-motion'
import {AiOutlineFieldNumber} from "react-icons/ai";
import {InputError, type InputTypeBase} from "./Input.tsx";

export type InputNumberType = InputTypeBase & {
    min?: number
    max?: number
    validation?: Omit<
        RegisterOptions<FieldValues, string>,
        'pattern' | 'valueAsDate'
    >
}

export const InputNumber = ({
                                label,
                                labelClassName,
                                id,
                                placeholder,
                                min,
                                max,
                                validation,
                            }: InputNumberType) => {
    const { register, formState: { errors } } = useFormContext<FieldValues>()

    const inputError = findInputError(errors, id)
    const isInvalid = isFormInvalid(inputError)

    return (
        <div className="mb-5">
            <label className={cn('input', labelClassName)}>
                {label ?? <AiOutlineFieldNumber />}

                <input
                    type="number"
                    id={id}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    // регистрируем поле формы через useFormContext
                    {...register(id, {
                        ...validation,
                        valueAsNumber: true,
                    })}
                />
            </label>

            <AnimatePresence mode="wait" initial={false}>
                {isInvalid && 'error' in inputError && (
                    <InputError message={inputError.error.message} />
                )}
            </AnimatePresence>
        </div>
    )
}