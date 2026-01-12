import { useState } from "react"
import { Alert } from "../alert/Alert"

export type ToastType = {
    type: "info" | "success" | "warning"
    message: string
}

export const Toast = ({type, message}: ToastType) => {
    const [showToast, setShowToast] = useState(true)

    return (
        <div className="toast toast-center toast-bottom">
            {showToast && (
                <Alert
                    type={type}
                    message={message}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    )
}
