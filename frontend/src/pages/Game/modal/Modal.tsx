import {forwardRef, useImperativeHandle, useRef, useState, useEffect} from "react"

export type ModalHandle = {
    open: () => void
    close: () => void
}

type ModalProps = {
    title?: string
    classNames?: string
    width?: string
    children: React.ReactNode
    showCloseButton?: boolean
    closeOnBackdropClick?: boolean // Новая опция
}

export const Modal = forwardRef<ModalHandle, ModalProps>(
    ({
         title,
         classNames = "bg-white",
         width,
         showCloseButton = true, // Значение по умолчанию
         closeOnBackdropClick = true, // Значение по умолчанию
         children
     }, ref) => {
        const dialogRef = useRef<HTMLDialogElement>(null)
        const [isOpen, setIsOpen] = useState(false)

        useImperativeHandle(ref, () => ({
            open: () => {
                dialogRef.current?.showModal()
                setIsOpen(true)
            },
            close: () => {
                dialogRef.current?.close()
                setIsOpen(false)
            },
        }))

        // Обработчик клика по dialog element
        const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
            if (!closeOnBackdropClick) return

            const dialog = dialogRef.current
            if (!dialog) return

            // Проверяем, кликнули ли мы по backdrop (вне modal-box)
            const rect = dialog.getBoundingClientRect()
            const clickedInDialog = (
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width
            )

            if (!clickedInDialog) {
                dialog.close()
            }
        }

        // Слушаем событие close
        useEffect(() => {
            const dialog = dialogRef.current
            if (!dialog) return

            const handleClose = () => setIsOpen(false)
            dialog.addEventListener('close', handleClose)

            return () => {
                dialog.removeEventListener('close', handleClose)
            }
        }, [])

        return (
            <dialog
                ref={dialogRef}
                className="modal"
                onClick={handleDialogClick}
            >
                <div className={`modal-box max-h-[90vh] ${classNames}`} style={{width}}>
                    {showCloseButton && (
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => dialogRef.current?.close()}
                            type="button"
                        >
                            ✕
                        </button>
                    )}
                    {title && <h3 className="text-lg font-bold">{title}</h3>}

                    <div className="py-4">{children}</div>
                </div>
                {/*
                    Если closeOnBackdropClick=false, убираем форму с method="dialog"
                    так как она автоматически закрывает модалку
                */}
                {closeOnBackdropClick && (
                    <form method="dialog" className="modal-backdrop bg-black/70">
                        <button type="submit">close</button>
                    </form>
                )}
            </dialog>
        )
    }
)