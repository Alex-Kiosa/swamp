import {useEffect, useRef, useState} from "react"
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks.ts"
import {getGameThunk, joinGameThunk} from "../../features/games/actions/games-actions.ts"
import styles from "./Game.module.css"
import {Chips} from "./chips/Chips.tsx"
import {Fab} from "./FAB/Fab.tsx"
import {socket} from "../../socket.ts"
import {selectGame} from "../../features/games/model/gameSelectors.ts";
import {Navigate, useNavigate, useParams} from "react-router";
import {Form} from "../../components/form/Form.tsx";
import {name_validation} from "../../common/utils/inputValidations.ts";
import {Input} from "../../components/input/Input.tsx";
import {Modal, type ModalHandle} from "./modal/Modal.tsx";

export const Game = () => {
    const {gameId} = useParams<{ gameId: string }>()
    const navigate = useNavigate()
    const {isActive, gameInitialized} = useAppSelector(selectGame)
    const modalRef = useRef<ModalHandle>(null)
    const dispatch = useAppDispatch()
    const [showJoinForm, setShowJoinForm] = useState(false)

    const token = localStorage.getItem("token")
    const questToken = localStorage.getItem("guestToken")

    const joinFormSubmit = (data) => {
        if (gameId) {
            dispatch(joinGameThunk(gameId, data["input-name"]))
            setShowJoinForm(false)
        }
    }

    useEffect(() => {
        if (gameInitialized && !isActive) {
            navigate("/404", {replace: true})
        }
    }, [gameInitialized, isActive]);

    useEffect(() => {
        if (showJoinForm && modalRef.current) {
            modalRef.current.open()
        } else if (modalRef.current) {
            modalRef.current.close()
        }
    }, [showJoinForm]);

    useEffect(() => {
        if (!gameId) return

        if (token || questToken) {
            dispatch(getGameThunk(gameId))
            return
        }

        setShowJoinForm(true)
    }, [gameId])

    useEffect(() => {
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [])

    return (
        <div className={styles.wrap}>
            {showJoinForm ?
                <Modal ref={modalRef} closeOnBackdropClick={false} showCloseButton={false}>
                    <Form onSubmit={joinFormSubmit} submitText={"Подтвердить"}><Input {...name_validation}/></Form>
                </Modal> :
                <>
                    <Chips/>
                    <Fab/>
                </>
            }
        </div>
    )
}