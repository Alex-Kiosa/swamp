import {useRef} from "react";
import {useToast} from "../../contexts/ToastContext.tsx";

type Props = {
    styles: string
    text?: string
    urlForCopy: string
    className?: string
}

export const ShareLinkButton = ({className, styles, text = "Скопировать ссылку", urlForCopy}: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const {showToast} = useToast()

    const onClickHandler = () => {
        navigator.clipboard.writeText(urlForCopy)
            .then(() => {
                showToast({
                    type: "success",
                    message: "Сохранено"
                })
            })
            .catch(err => {
                console.error('Ошибка при копировании:', err)
            })
    }

    return (
        <button
            ref={buttonRef}
            className={`${className} ${styles}`}
            onClick={onClickHandler}
            title={"копировать ссылку"}>
            {text}
            {/*<FaCopy/>*/}
        </button>
    )
}