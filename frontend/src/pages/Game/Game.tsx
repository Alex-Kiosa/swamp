import {useEffect, useRef, useState} from "react"
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks"
import {getGameThunk, joinGameThunk} from "../../features/games/actions/games-actions"
import {Chips} from "./chips/Chips"
import {selectGame} from "../../features/games/model/gameSelectors"
import {useNavigate, useParams} from "react-router"
import {Form} from "../../components/form/Form"
import {name_validation} from "../../common/utils/inputValidations"
import {Input} from "../../components/input/Input"
import {Modal, type ModalHandle} from "./modal/Modal"
import {useSocketConnection} from "../../sockets/useSocketConnection"
import {useChipSockets} from "../../sockets/useChipSockets"
import {Cube} from "../../features/cube/ui/Cube.tsx"
import {Players} from "./players/Players"
import {DeckCards} from "../../features/cards/ui/DeckCards.tsx"
import {useCardSockets} from "../../sockets/useCardSockets"
import {usePlayerSockets} from "../../sockets/usePlayerSockets"
import {TableCards} from "../../features/cards/ui/TableCards"
import boardImage from "./assets/board.jpg"
import {DropdownHost} from "./dropdownHost/DropdownHost.tsx";

export const Game = () => {
    const {gameId} = useParams<{ gameId: string }>()
    const navigate = useNavigate()
    const {isActive, gameInitialized, isHost} = useAppSelector(selectGame)
    const modalRef = useRef<ModalHandle>(null)
    const dispatch = useAppDispatch()
    const [showJoinForm, setShowJoinForm] = useState(false)

    const token = localStorage.getItem("token")
    const socketToken = localStorage.getItem("socketToken")

    const joinFormSubmit = (data: any) => {
        if (gameId) {
            dispatch(joinGameThunk(gameId, data["input-name"]))
            setShowJoinForm(false)
        }
    }

    // TODO: сделать zoom и drag and drop для поля с игрой

    // SOCKETS + NAVIGATION LOGIC
    usePlayerSockets(gameId)
    useChipSockets()
    useCardSockets()
    useSocketConnection(gameId, socketToken)

    useEffect(() => {
        if (gameInitialized && !isActive) {
            navigate("/404", {replace: true})
        }
    }, [gameInitialized, isActive])


    useEffect(() => {
        if (showJoinForm && modalRef.current) {
            modalRef.current.open()
        } else {
            modalRef.current?.close()
        }
    }, [showJoinForm])

    useEffect(() => {
        if (!gameId) return
        if (token || socketToken) {
            dispatch(getGameThunk(gameId))
            return
        }
        setShowJoinForm(true)
    }, [gameId])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].includes(e.key)) {
                e.preventDefault()
            }
        }
        const handleWheelGlobal = (e: WheelEvent) => {
            if (e.ctrlKey) e.preventDefault()
        }
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("wheel", handleWheelGlobal, {passive: false})

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("wheel", handleWheelGlobal)
        }
    }, [])

    return (
        <div className="w-screen h-screen overflow-hidden relative flex">
            {showJoinForm ? (
                <Modal
                    ref={modalRef}
                    closeOnBackdropClick={false}
                    showCloseButton={false}
                >
                    <Form onSubmit={joinFormSubmit} submitText="Подтвердить">
                        <Input {...name_validation} />
                    </Form>
                </Modal>
            ) : (
                <>
                    {/* LEFT TOOLS PANEL */}
                    <div className="w-[340px] p-5 shrink-0">
                        <div className="flex">
                            <div className="alert block mb-6 p-6 rounded-lg flex justify-center flex-1">
                                {gameId && <Cube gameId={gameId}/>}
                            </div>
                            {isHost && <DropdownHost/> }
                        </div>

                        <div className="alert block mb-6 p-6 rounded-lg">
                            <div className="text-lg font-bold text-center">
                                Список игроков
                            </div>
                            <Players/>
                        </div>

                        <div className="alert block mb-6 p-6 rounded-lg">
                            <div className="text-lg font-bold text-center">
                                Карты на столе
                            </div>
                            <TableCards isHost={isHost} gameId={gameId}/>
                        </div>
                    </div>

                    {/* GAME BOARD */}
                    <div className="pt-5 pr-5 flex-1 ">
                        <div
                            className="border-1 rounded-lg overflow-hidden"
                            style={{
                                backgroundImage: "repeating-linear-gradient(-45deg,var(--color-base-100),var(--color-base-100)13px,var(--color-base-200)13px,var(--color-base-200)14px)",
                                backgroundColor: "#e1e6d9"
                        }}
                        >
                            <div
                                className="h-[77vh] bg-no-repeat bg-contain"
                                style={{
                                    backgroundImage: `url(${boardImage})`,
                                    aspectRatio: "24 / 17",
                                }}
                            >
                                <Chips/>
                            </div>
                        </div>

                        {/* DECKS */}
                        <div className="mt-4">
                            <DeckCards/>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}