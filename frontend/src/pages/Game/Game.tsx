import {useEffect, useRef, useState} from "react"
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks"
import {getGameThunk, joinGameThunk} from "../../features/games/actions/games-actions"
import styles from "./Game.module.css"
import {Chips} from "./chips/Chips"
import {Fab} from "./FAB/Fab"
import {socket} from "../../socket"
import {selectGame} from "../../features/games/model/gameSelectors"
import {useNavigate, useParams} from "react-router"
import {Form} from "../../components/form/Form"
import {name_validation} from "../../common/utils/inputValidations"
import {Input} from "../../components/input/Input"
import {Modal, type ModalHandle} from "./modal/Modal"
import {Cube} from "./cube/Cube"
import {useSocketConnection} from "../../common/hooks/sockets/useSocketConnection.ts";
import {useChipSockets} from "../../common/hooks/sockets/useChipSockets.ts";
import {useCubeSockets} from "../../common/hooks/sockets/useCubeSockets.ts";

export const Game = () => {
    const {gameId} = useParams<{ gameId: string }>()
    const navigate = useNavigate()
    const {isActive, gameInitialized, isHost} = useAppSelector(selectGame)
    const modalRef = useRef<ModalHandle>(null)
    const dispatch = useAppDispatch()
    const [showJoinForm, setShowJoinForm] = useState(false)

    // состояние кубика
    const [cubeValue, setCubeValue] = useState(1)
    const [isRolling, setIsRolling] = useState(false)

    // sockets
    useSocketConnection(gameId)
    useChipSockets()
    useCubeSockets(setIsRolling, setCubeValue)

    const token = localStorage.getItem("token")
    const socketToken = localStorage.getItem("socketToken")

    const joinFormSubmit = (data) => {
        if (gameId) {
            dispatch(joinGameThunk(gameId, data["input-name"]))
            setShowJoinForm(false)
        }
    }

    const rollCube = () => {
        if (!gameId) return
        socket.emit("cube:roll", {gameId})
    }

    useEffect(() => {
        if (gameInitialized && !isActive) {
            navigate("/404", {replace: true})
        }
    }, [gameInitialized, isActive])

    useEffect(() => {
        if (showJoinForm && modalRef.current) {
            modalRef.current.open()
        } else if (modalRef.current) {
            modalRef.current.close()
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

    return (
        <div className={styles.wrap}>
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
                    <Chips/>
                    <Cube value={cubeValue} isRolling={isRolling}/>
                    {isHost && (
                        <button
                            className={styles.rollButton}
                            disabled={isRolling}
                            onClick={rollCube}
                        >
                            🎲 Бросить кубик
                        </button>
                    )}
                    <Fab/>
                </>
            )}
        </div>
    )
}