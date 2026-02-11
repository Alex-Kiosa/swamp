import { useState } from "react"
import { Alert } from "../alert/Alert"

export type ToastType = {
    type: "info" | "success" | "warning"
    message: string
    styles?: string
}

export const Toast = ({type, message, styles}: ToastType) => {
    const [showToast, setShowToast] = useState(true)

    return (
        <div className={`toast  ${styles}`}>
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
