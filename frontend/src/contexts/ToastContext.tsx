import { createContext, useContext, useState } from "react"
import {Alert} from "../components/alert/Alert.tsx";

type ToastData = {
    id: number
    type: "info" | "success" | "warning"
    message: string
}

type ToastContextType = {
    showToast: (toast: Omit<ToastData, "id">) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastData[]>([])

    const showToast = (toast: Omit<ToastData, "id">) => {
        const id = Date.now()
        setToasts(prev => [...prev, { ...toast, id }])

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 5000)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <div className="toast toast-middle toast-center">
                {toasts.map(t => (
                    <Alert
                        key={t.id}
                        type={t.type}
                        message={t.message}
                        onClose={() =>
                            setToasts(prev => prev.filter(x => x.id !== t.id))
                        }
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast must be used inside ToastProvider")
    return ctx
}
