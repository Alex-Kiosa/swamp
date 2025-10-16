import {type ChangeEvent, useState} from "react";
import {FaRegEye} from "react-icons/fa";

type Props = {
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string

}

export const PasswordInput = ({value, onChange, placeholder}: Props) => {
    const [isHide, setHide] = useState(true)

    const toggleHidePassword = () => {
        setHide(!isHide)
    }

    return (
        <label className="input">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                    ></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
            </svg>
            <input
                value={value}
                type={isHide ? "password" : "text"}
                placeholder={placeholder || "Пароль" }
                className="input-primary"
                onChange={onChange}
            />
            <FaRegEye
                size={22}
                className={"text-lime-900 cursor-pointer hover:text-lime-950"}
                onClick={() => toggleHidePassword()}
            />
        </label>
    )
}