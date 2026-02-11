import {useRef} from "react";
import {useToast} from "../../contexts/ToastContext.tsx";

type Props = {
    styles: string
    text?: string
    urlForCopy: string
}

export const ShareLinkButton = ({styles, text = "Скопировать ссылку на игру", urlForCopy}: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const {showToast} = useToast()

    const onClickHandler = () => {
            navigator.clipboard.writeText(urlForCopy)
                .then(() => {
                    showToast({
                        type: "success",
                        message: "Текст скопирован"
                    })
                })
                .catch(err => {
                    console.error('Ошибка при копировании:', err)
                })
    }

    return (
        <button
            ref={buttonRef}
            className={styles}
            onClick={onClickHandler}
            title={"копировать ссылку"}>
            {text}
            {/*<FaCopy/>*/}
        </button>
    )
}