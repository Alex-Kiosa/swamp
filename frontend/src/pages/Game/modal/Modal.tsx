import { forwardRef, useImperativeHandle, useRef } from "react"

export type ModalHandle = {
    open: () => void
    close: () => void
}

type ModalProps = {
    title?: string
    classNames?: string
    children: React.ReactNode
}

export const Modal = forwardRef<ModalHandle, ModalProps>(
    ({ title, classNames = "bg-white", children }, ref) => {
        const dialogRef = useRef<HTMLDialogElement>(null)

        useImperativeHandle(ref, () => ({
            open: () => dialogRef.current?.showModal(),
            close: () => dialogRef.current?.close(),
        }))

        return (
            <dialog ref={dialogRef} className="modal">
                <div className={`modal-box ${classNames}`}>
                    <button
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => dialogRef.current?.close()}
                    >✕
                    </button>
                    <h3 className="text-lg font-bold">{title}</h3>

                    <div className="py-4">{children}</div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        )
    }
)
