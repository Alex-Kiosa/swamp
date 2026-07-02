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

    // TODO: убрать мигание страницы с игрой в момент загрузки
    useEffect(() => {
        if (!gameId) return

        dispatch(getGameThunk(gameId))
    }, [gameId])

    useEffect(() => {
        if (status !== "succeeded") return

        if (!authToken && !playerId) {
            setShowJoinForm(true)
        }
    }, [status, authToken, playerId])

    // useEffect(() => {
    //     if (!gameId) return
    //     if (authToken || playerId) {
    //         dispatch(getGameThunk(gameId))
    //         return
    //     }
    //     setShowJoinForm(true)
    // }, [gameId])

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
                    <div
                        className="basis-[280px] min-w-[260px] max-w-[340px] shrink-0 p-5 flex flex-col h-full min-h-0">
                        <div className="flex-1 min-h-0">
                            {status === "succeeded" && gameId && playerName && (
                                <VideoRoom
                                    gameId={gameId}
                                    participantName={playerName}
                                />
                            )}
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
                                {/*Кубик*/}
                                <div className="flex p-6">
                                    {gameId && <Cube gameId={gameId} socket={socket}/>}
                                    <div className="ml-5">
                                        {isHost && <DropdownHost/>}
                                    </div>
                                </div>

                                {/*Фишки*/}
                                <Chips boardRef={boardRef} socket={socket}/>

                                {/*Карты на столе*/}
                                {gameId && (
                                    <TableCards
                                        isHost={isHost}
                                        gameId={gameId}
                                        socket={socket}
                                    />
                                )}
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