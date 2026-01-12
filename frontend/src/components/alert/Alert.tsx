import {getIcon} from "../../common/utils/helper.ts";

export type AlertType = {
    type: "info" | "success" | "error" | "warning"
    message: string
    onClose?: () => void
}

export const Alert = ({ type, message, onClose }: AlertType) => {
    return (
        <div role="alert" className={`alert alert-${type} flex justify-between`}>
            <div className="flex items-center gap-2">
                {getIcon(type)}
                <span>{message}</span>
            </div>

            {onClose && (
                <button
                    className="btn btn-ghost btn-sm btn-circle hover:bg-current/10 active:bg-current/20 border-0"
                    onClick={onClose}
                >
                    ✕
                </button>
            )}
        </div>
    )
}