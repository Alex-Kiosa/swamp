import cn from 'classnames'
import {findInputError} from '../../utils/findInputError.ts'
import {isFormInvalid} from '../../utils/isFormInvalid.ts'
import {useFormContext} from 'react-hook-form'
import {AnimatePresence, motion} from 'framer-motion'
import {EmailMyIcon} from "../../assets/customIcons/EmailMyIcon.tsx";
import {PiKeyThin} from "react-icons/pi";
import {RxCheck, RxFace, RxInfoCircled, RxMobile} from "react-icons/rx";

export type InputType = {
    label?: string
    type: "text" | "email" | "password" | "tel" | "number"
    id: string
    placeholder: string
    validation: ValidationInputType
    className?: string
}

export type ValidationInputType = {
    required?: { value: boolean; message: string }
    minLength?: { value: number; message: string }
    maxLength?: { value: number; message: string }
    pattern?: { value: RegExp; message: string }
}

export const Input = ({label, type, id, placeholder, validation, className}: InputType) => {
    const {register, formState: {errors}} = useFormContext()

    const inputError = findInputError(errors, id)
    const isInvalid = isFormInvalid(inputError)

    const icons = {
        text: <RxFace />,
        email: <EmailMyIcon/>,
        password: <PiKeyThin/>,
        tel: <RxMobile />,
        number: <RxCheck />,
    }

    return (
        <div className="mb-5">
            <label className={cn("input", className)}>
                {label ? label : icons[type]}
                <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    {...register(id, validation)}
                />
            </label>
            <AnimatePresence mode="wait" initial={false}>
                {isInvalid && "error" in inputError && (
                    <InputError
                        message={inputError.error.message}
                        // key={inputError.error.message}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export const InputError = ({message}: {message: string}) => {
    return (
        <motion.p
            className="mt-2 flex items-center gap-2 py-1 px-2 font-medium text-sm text-red-500 bg-red-100 rounded-md"
            {...framer_error}
        >
            <RxInfoCircled/>
            {message}
        </motion.p>
    )
}

export const framer_error = {
    initial: {opacity: 0, y: 10},
    animate: {opacity: 1, y: 0},
    exit: {opacity: 0, y: 10},
    transition: {duration: 0.2},
}