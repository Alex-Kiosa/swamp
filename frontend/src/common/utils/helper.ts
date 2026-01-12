import type {AlertType} from "../../components/alert/Alert.tsx";

const ICONS: Record<AlertType["type"], string> = {
    success: "✔️",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
}

export const getIcon = (type: AlertType["type"]) => ICONS[type]