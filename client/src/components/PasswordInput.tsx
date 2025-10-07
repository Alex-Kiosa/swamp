import {type ChangeEvent, useState} from "react";
import {FaRegEye} from "react-icons/fa";

type Props = {
    value: string
    onChange: (e:ChangeEvent<HTMLInputElement>) => void
    placeholder?: string

}

export const PasswordInput = ({value, onChange, placeholder}: Props) => {
    const [isHide, setHide] = useState(true)

    const toggleHidePassword = () => {
        setHide(!isHide)
    }

    return (
        <div className="flex items-center justify-between bg-transparent input-primary">
            <input
                value={value}
                type={isHide ? "password" : "text"}
                placeholder={placeholder || "Пароль"}
                // required
                onChange={onChange}
                className={"w-full outline-none"}
            />

            <FaRegEye
                size={22}
                className={"text-lime-900 cursor-pointer hover:text-lime-950"}
                onClick={()=> toggleHidePassword()}
            />
        </div>
    )
}