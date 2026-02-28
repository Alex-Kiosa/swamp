import {ShareLinkButton} from "../../../components/button/shareLinkButton.tsx";
import {AddChipsForm} from "../addChipForm/AddChipsForm.tsx";
import {Modal, type ModalHandle} from "../modal/Modal.tsx";
import {useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks.ts";
import {selectGame} from "../../../features/games/model/gameSelectors.ts";
import {deleteChipsByGameThunk} from "../../../features/games/actions/games-actions.ts";

export const DropdownHost = () => {
    const modalRef = useRef<ModalHandle>(null)
    const dispatch = useAppDispatch()
    const {gameId, chips} = useAppSelector(selectGame)
    const gameUrl =  `${window.location.origin}/game/${gameId}`

    const deleteChipsHandler = () => {
        if (gameId) dispatch(deleteChipsByGameThunk(gameId))
    }

    return <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1"><svg
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
        </svg></div>
        <div tabIndex="-1" className="dropdown-content menu bg-white rounded-box z-1 w-52 p-2 shadow-sm">
            <button className="btn btn-neutral mb-3" onClick={() => modalRef.current?.open()}>Добавить фишку</button>
            <ShareLinkButton styles={"btn"} className={"mb-3"} urlForCopy={gameUrl}/>
            <button className="btn btn-error " onClick={deleteChipsHandler} disabled={chips.length === 0 || false}>Удалить все фишки</button>
        </div>
        <Modal ref={modalRef}>
            <AddChipsForm onSuccess={() => modalRef.current?.close()}/>
        </Modal>
    </div>
}