import {useEffect, useRef, useState} from "react"
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks"
import {getGameThunk, joinGameThunk} from "../../features/games/actions/games-actions"
import {Chips} from "./chips/Chips"
import {selectGame} from "../../features/games/model/gameSelectors"
import {useParams} from "react-router"
import {Form, type FormDataFields} from "../../components/form/Form"
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
import {NotFound} from "../NotFound.tsx";
import {Loading} from "../../components/loading/Loading.tsx";
import {VideoRoom} from "./videoRoom/VideoRoom.tsx";

export const Game = () => {
    const {status, isHost} = useAppSelector(selectGame)
    const {gameId} = useParams<{ gameId: string }>()
    const modalRef = useRef<ModalHandle>(null)
    const dispatch = useAppDispatch()
    const [showJoinForm, setShowJoinForm] = useState(false)
    const boardRef = useRef<HTMLDivElement>(null)

    const socketToken = localStorage.getItem("socketToken")
    const authToken = localStorage.getItem("token")

    const joinFormSubmit = (data: FormDataFields) => {
        if (gameId) {
            dispatch(joinGameThunk(gameId, data["input-name"]))
            setShowJoinForm(false)
        }
    }

    const [start, setStart] = useState(false)

    const socket = useSocketConnection(gameId, socketToken)

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
        if (socketToken || authToken) {
            dispatch(getGameThunk(gameId))
            return
        }
        setShowJoinForm(true)
    }, [gameId])

    if (status === "loading") {
        return <Loading />
    }

    if (status === "not_found") {
        return <NotFound title={"Игра не найдена"} description={"Такой игры нет, или она закончилась"} />
    }

    return (
        <div className="w-screen h-screen overflow-hidden relative flex">
            {showJoinForm ? (
                <Modal ref={modalRef} closeOnBackdropClick={false} showCloseButton={false}>
                    <Form onSubmit={joinFormSubmit} submitText="Подтвердить">
                        <Input {...name_validation} />
                    </Form>
                </Modal>
            ) : (
                <>
                    <div className="w-[340px] p-5 shrink-0 flex flex-col h-full">
                        <div className="flex">
                            <div className="alert mb-6 p-6 rounded-lg flex justify-center flex-1">
                                {gameId && <Cube gameId={gameId} socket={socket}/>}
                            </div>
                            {isHost && <DropdownHost/> }
                        </div>

                        <div className="alert block mb-6 p-6 rounded-lg">
                            {/*<div className="text-lg font-bold text-center">Наши игроки</div>*/}
                            <Players/>
                        </div>

                        {/*{!start && (*/}
                        {/*    <button className={"btn-primary"} onClick={() => setStart(true)}>*/}
                        {/*        Start video*/}
                        {/*    </button>*/}
                        {/*)}*/}

                        {/*{start && gameId && (*/}
                        {/*    <VideoRoom*/}
                        {/*        key={gameId}*/}
                        {/*        gameId={gameId}*/}
                        {/*        // playerName={"Player"}*/}
                        {/*    />*/}
                        {/*)}*/}

                        <div className="alert block mb-6 p-6 rounded-lg overflow-y-scroll">
                            <div className="text-lg font-bold text-center">Карты на столе</div>
                            {gameId && <TableCards isHost={isHost} gameId={gameId} socket={socket}/>}
                        </div>
                    </div>

                    {/* GAME BOARD */}
                    <div className="pt-5 pr-5 flex-1">
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
    )
}