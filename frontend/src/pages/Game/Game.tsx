import {useEffect, useRef, useState} from "react"
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks"
import {getGameThunk, joinGameThunk} from "../../features/games/actions/games-actions"
import {Chips} from "./chips/Chips"
import {selectCurrentUser, selectGame} from "../../features/games/model/gameSelectors"
import {useParams} from "react-router"
import {BaseForm, type FormDataFields} from "../../components/form/BaseForm.tsx"
import {name_validation} from "../../common/utils/inputValidations"
import {Input} from "../../components/input/Input"
import {Modal, type ModalHandle} from "./modal/Modal"
import {useSocketConnection} from "../../sockets/useSocketConnection"
import {useChipSockets} from "../../sockets/useChipSockets"
import {Cube} from "../../features/cube/ui/Cube.tsx"
import {DeckCards} from "../../features/cards/ui/DeckCards.tsx"
import {useCardSockets} from "../../sockets/useCardSockets"
import {usePlayerSockets} from "../../sockets/usePlayerSockets"
import {TableCards} from "../../features/cards/ui/TableCards"
import boardImage from "./assets/board.jpg"
import {DropdownHost} from "./dropdownHost/DropdownHost.tsx"
import {NotFound} from "../NotFound.tsx"
import {Loading} from "../../components/loading/Loading.tsx"
import {VideoRoom} from "../../features/games/video/ui/VideoRoom.tsx";

export const Game = () => {
    const {status, isHost, players} = useAppSelector(selectGame)
    const currentUser = useAppSelector(selectCurrentUser)

    const {gameId} = useParams<{ gameId: string }>()
    const modalRef = useRef<ModalHandle>(null)
    const dispatch = useAppDispatch()
    const [showJoinForm, setShowJoinForm] = useState(false)
    const boardRef = useRef<HTMLDivElement>(null)

    const authToken = localStorage.getItem("token")
    const playerId = localStorage.getItem("playerId")
    const playerName =
        players.find(player => player.playerId === playerId)?.name
        ??
        players.find(player => player.playerId === currentUser?.id)?.name
        ??
        ""

    const joinFormSubmit = (data: FormDataFields) => {
        if (gameId) {
            dispatch(joinGameThunk(gameId, data["input-name"]))
            setShowJoinForm(false)
        }
    }

    const canConnect = Boolean(authToken || playerId)

    const socket = useSocketConnection(canConnect ? gameId : undefined)

    usePlayerSockets(socket)
    useChipSockets(socket)
    useCardSockets(socket)

    useEffect(() => {
        if (showJoinForm && modalRef.current) {
            modalRef.current.open()
        } else {
            modalRef.current?.close()
        }
    }, [showJoinForm])

    useEffect(() => {
        if (!gameId) return
        if (authToken || playerId) {
            dispatch(getGameThunk(gameId))
            return
        }
        setShowJoinForm(true)
    }, [gameId])

    if (status === "not_found") {
        return <NotFound title={"Игра не найдена"} description={"Такой игры нет, или она закончилась"}/>
    }

    return <>
        {status === "loading" && <Loading/>}
        <div className="w-screen h-screen overflow-hidden relative flex">
            {showJoinForm ? (
                <Modal ref={modalRef} closeOnBackdropClick={false} showCloseButton={false}>
                    <BaseForm
                        onSubmit={joinFormSubmit}
                        submitText="Подтвердить"
                        classNames={"w-xs"}
                    >
                        <Input {...name_validation} />
                    </BaseForm>
                </Modal>
            ) : (
                <>
                    <div className="basis-[280px] min-w-[260px] max-w-[340px] shrink-0 p-5 flex flex-col h-full">
                        <div className="flex">
                            <div className="alert mb-6 p-6 rounded-lg flex justify-center flex-1">
                                {gameId && <Cube gameId={gameId} socket={socket}/>}
                            </div>
                            {isHost && <DropdownHost/>}
                        </div>

                        {/*<div className="alert block mb-6 p-6 rounded-lg">*/}
                        {/*    <div className="text-lg font-bold text-center">Наши игроки</div>*/}
                        {/*    <Players/>*/}
                        {/*</div>*/}

                        {status === "succeeded" && gameId && playerName && (
                            <VideoRoom
                                gameId={gameId}
                                participantName={playerName}
                            />
                        )}

                        <div className="alert block mb-6 p-6 rounded-lg overflow-y-scroll">
                            <div className="text-lg font-bold text-center">Карты на столе</div>
                            {gameId && <TableCards isHost={isHost} gameId={gameId} socket={socket}/>}
                        </div>
                    </div>

                    {/* GAME BOARD */}
                    <div className="pt-5 pr-5 flex-1 shrink-0">
                        <div className="border-1 rounded-lg overflow-hidden">
                            <div
                                ref={boardRef}
                                className="h-[75vh] bg-no-repeat bg-contain relative"
                                style={{
                                    backgroundImage: `url(${boardImage})`,
                                    aspectRatio: "24 / 17",
                                }}
                            >
                                <Chips boardRef={boardRef} socket={socket}/>
                            </div>
                        </div>

                        <div className="mt-4">
                            <DeckCards socket={socket}/>
                        </div>
                    </div>
                </>
            )}
        </div>
    </>
}