import {CiUser} from "react-icons/ci";
import { PiKeyThin } from "react-icons/pi";
import {EmailMyIcon} from "../../assets/customIcons/EmailMyIcon.tsx";

type Props = {
    type: "text" | "email" | "password"
    placeholder?: string
    value?: string
    setValue: (newValue: string) => void
    autoComplete?: string
    className: string
    error?: string | null
}

export const OldInput = ({type, placeholder, value, setValue, autoComplete, className, error}: Props
) => {
    const icons = {
        text: <CiUser/>,
        email: <EmailMyIcon />,
        password: <PiKeyThin />,
    }

    return (
        <div className="mb-5">
            <label className="input">
                {icons[type]}
                <input
                    type={type}
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={className}
                />
            </label>

            {error && <div className="text-red-700 text-xs mt-2">{error}</div>}
        </div>
    )
}