import {RxInfoCircled} from "react-icons/rx";

type AlertColor = "info" | "success" | "error" | "warning"


type Props = {
    text: string
    color?: AlertColor
    className?: string
}

export const Alert = ({color, text}: Props) => {
    return (
        <div role="alert" className={`rounded-field alert alert-${color}`}>
            <RxInfoCircled/>
            <span>{text}</span>
        </div>
    )
}