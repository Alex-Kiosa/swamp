import cn from 'classnames'
import {findInputError} from '../../common/utils/findInputError.ts'
import {isFormInvalid} from '../../common/utils/isFormInvalid.ts'
import {type FieldValues, type RegisterOptions, useFormContext} from 'react-hook-form'
import {AnimatePresence, motion} from 'framer-motion'
import {RxEyeClosed, RxEyeOpen, RxFace, RxInfoCircled, RxMobile} from "react-icons/rx";
import {useState} from "react";
import {IoKeyOutline} from "react-icons/io5";
import {CiMail} from "react-icons/ci";
import {TiPipette} from "react-icons/ti";

export type InputTypeBase = {
    label?: string
    labelClassName?: string
    id: string
    placeholder?: string
}

export type InputType = InputTypeBase & {
    type?: 'text' | 'email' | 'password' | 'tel' | 'color'
    validation?: RegisterOptions<FieldValues, string>
}

export const Input = ({
                          label,
                          labelClassName,
                          id,
                          placeholder,
                          type = 'text',
                          validation,
                      }: InputType) => {
    const { register, formState: { errors } } = useFormContext<FieldValues>()
    const [showPass, setShowPass] = useState(false)

    const inputError = findInputError(errors, id)
    const isInvalid = isFormInvalid(inputError)

    const icons = {
        text: <RxFace />,
        email: <CiMail />,
        password: <IoKeyOutline />,
        tel: <RxMobile />,
        color: <TiPipette />,
    }

    return (
        <div className="mb-5">
            <label className={cn('input', labelClassName)}>
                {label ?? icons[type]}

                <input
                    type={type === 'password' ? (showPass ? 'text' : 'password') : type}
                    id={id}
                    placeholder={placeholder}
                    // регистрируем поле формы через useFormContext
                    {...register(id, validation)}
                />

                {type === 'password' && (
                    <span>
            {showPass ? (
                <RxEyeClosed size={20} onClick={() => setShowPass(false)} />
            ) : (
                <RxEyeOpen size={20} onClick={() => setShowPass(true)} />
            )}
          </span>
                )}
            </label>

            <AnimatePresence mode="wait" initial={false}>
                {isInvalid && 'error' in inputError && (
                    <InputError message={inputError.error.message} />
                )}
            </AnimatePresence>
        </div>
    )
}


export const InputError = ({message}: { message: string | undefined }) => {
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