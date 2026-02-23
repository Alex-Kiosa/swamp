import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useEffect
} from "react"

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
    closeOnBackdropClick?: boolean
    onClickBackdrop?: () => void
}

export const ModalOld = forwardRef<ModalHandle, ModalProps>(
    (
        {
            title,
            classNames = "bg-white",
            width,
            showCloseButton = true,
            closeOnBackdropClick = true,
            onClickBackdrop,
            children
        },
        ref
    ) => {
        const dialogRef = useRef<HTMLDialogElement>(null)

        useImperativeHandle(ref, () => ({
            open: () => {
                dialogRef.current?.showModal()
            },
            close: () => {
                dialogRef.current?.close()
            }
        }))

        // 🔥 ЕДИНАЯ точка обработки закрытия
        useEffect(() => {
            const dialog = dialogRef.current
            if (!dialog) return

            const handleClose = () => {
                onClickBackdrop?.()
            }

            dialog.addEventListener("close", handleClose)

            return () => {
                dialog.removeEventListener("close", handleClose)
            }
        }, [onClickBackdrop])

        return (
            <dialog
                ref={dialogRef}
                className="modal"
            >
                <div
                    className={`modal-box max-h-[90vh] ${classNames}`}
                    style={{ width }}
                >
                    {showCloseButton && (
                        <form method="dialog">
                            <button
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                type="submit"
                            >
                                ✕
                            </button>
                        </form>
                    )}

                    {title && (
                        <h3 className="text-lg font-bold">
                            {title}
                        </h3>
                    )}

                    <div className="py-4">
                        {children}
                    </div>
                </div>

                {closeOnBackdropClick && (
                    <form
                        method="dialog"
                        className="modal-backdrop bg-black/70"
                    >
                        <button type="submit">close</button>
                    </form>
                )}
            </dialog>
        )
    }
)

// задаёт имя компонента для React DevTools и сообщений об ошибках.
ModalOld.displayName = "Modal"