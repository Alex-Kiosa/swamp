import {useRef} from "react";
import {Modal, type ModalHandle} from "../modal/Modal.tsx";
import {AddChipsForm} from "../addChipForm/AddChipsForm.tsx";
import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks.ts";
import {deleteChipsByGameThunk} from "../../../features/games/actions/games-actions.ts";
import {selectGame} from "../../../features/games/model/gameSelectors.ts";

export const Fab = () => {
    const modalRef = useRef<ModalHandle>(null)
    const dispatch = useAppDispatch()
    const {gameId, chips} = useAppSelector(selectGame)

    const deleteChipsHandler = () => {
        if (gameId) dispatch(deleteChipsByGameThunk(gameId))
    }

    return <>
        <div className="fab">
            {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
            <div tabIndex={0} role="button" className="btn btn-lg btn-circle btn-primary">
                <svg
                    aria-label="Edit game's field"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="size-6"
                >
                    <path
                        fillRule="evenodd"
                        d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            {/* close button should not be focusable so it can close the FAB when clicked. It's just a visual placeholder */}
            <div className="fab-close">
                <span className="btn btn-circle btn-lg btn-secondary">✕</span>
            </div>

            {/* buttons that show up when FAB is open */}
            <button className="btn btn-primary" onClick={() => modalRef.current?.open()}>Добавить фишку</button>
            <button className="btn btn-error" onClick={deleteChipsHandler} disabled={chips.length === 0 || false}>Удалить все фишки</button>
        </div>
        <Modal ref={modalRef}>
            <AddChipsForm onSuccess={() => modalRef.current?.close()}/>
        </Modal>
    </>
}