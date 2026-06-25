import {
    FaCircleCheck,
    FaCircleInfo,
    FaCircleExclamation,
    FaCircleXmark,
} from "react-icons/fa6"

export type AlertType = {
    type: "info" | "success" | "error" | "warning" | "deck-empty"
    message: string
    onClose?: () => void
}

const alertClass = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
    "deck-empty": "alert-deck-empty",
}

const iconMap = {
    success: <FaCircleCheck className="flex-shrink-0 text-xl" />,
    error: <FaCircleXmark className="flex-shrink-0 text-xl" />,
    warning: <FaCircleExclamation className="flex-shrink-0 text-xl" />,
    info: <FaCircleInfo className="flex-shrink-0 text-xl" />,
    "deck-empty": <FaCircleInfo className="flex-shrink-0 text-xl" />,
}

export const Alert = ({ type, message, onClose }: AlertType) => {
    return (
        <div
            role="alert"
            className={`alert ${alertClass[type]} flex justify-between`}
        >
            <div className="flex items-center gap-2">
                {iconMap[type]}
                <span>{message}</span>
            </div>

            {onClose && (
                <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-circle hover:bg-current/10 active:bg-current/20 border-0"
                    onClick={onClose}
                >
                    ✕
                </button>
            )}
        </div>
    )
}