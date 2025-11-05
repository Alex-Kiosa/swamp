import {findInputError} from '../../common/utils/findInputError.ts'
import {isFormInvalid} from '../../common/utils/isFormInvalid.ts'
import {useFormContext} from 'react-hook-form'
import {AnimatePresence} from 'framer-motion'
import {InputError} from "../input/Input.tsx";

export type ValidationTextareaType = {
    required?: { value: boolean; message: string }
    minLength?: { value: number; message: string }
    maxLength?: { value: number; message: string }
}

export type TextareaType = {
    label?: string
    id: string
    placeholder: string
    validation: ValidationTextareaType
    className?: string
}

export const Textarea = ({label, id, placeholder, validation, className}: TextareaType) => {
    const {register, formState: {errors}} = useFormContext()

    const inputError = findInputError(errors, id)
    const isInvalid = isFormInvalid(inputError)

    if (label) {
        return (
            <div className="mb-5">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">{label}</legend>
                    <textarea
                        className="textarea h-24"
                        placeholder={placeholder}
                        id={id}
                        {...register(id, validation)}
                    ></textarea>
                    <div className="label">Необязательно</div>
                </fieldset>
                <AnimatePresence mode="wait" initial={false}>
                    {isInvalid && (
                        <InputError
                            message={inputError.error.message}
                            key={inputError.error.message}
                        />
                    )}
                </AnimatePresence>
            </div>
        )
    } else {
        return (
            <div className="mb-5">
                    <textarea
                        className="textarea h-24"
                        placeholder={placeholder}
                        id={id}
                        {...register(id, validation)}
                    ></textarea>
                <AnimatePresence mode="wait" initial={false}>
                    {isInvalid && (
                        <InputError
                            message={inputError.error.message}
                            key={inputError.error.message}
                        />
                    )}
                </AnimatePresence>
            </div>
        )
    }
}