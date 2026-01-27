import {useEffect} from "react"
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks.ts"
import {getGameThunk} from "../../features/games/actions/games-actions.ts"
import styles from "./Game.module.css"
import {Chips} from "./chips/Chips.tsx"
import {selectGame} from "../../features/games/model/gameSelectors.ts"
import {Fab} from "./FAB/Fab.tsx"
import {socket} from "../../socket.ts"
import {moveChip} from "../../features/games/model/game-reducer.ts"

export const Game = () => {
    const game = useAppSelector(selectGame)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getGameThunk())
    }, [])

    useEffect(() => {
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [])


    useEffect(() => {
        if (!game.gameId) return

        socket.emit("game:join", game.gameId)

        socket.on("chip:moved", chip => {
            dispatch(moveChip(chip))
        })

        return () => {
            socket.off("chip:moved")
            socket.emit("game:leave", game.gameId)
        }
    }, [game.gameId])


    return (
        <div className={styles.wrap}>
            <Chips/>
            <Fab/>
        </div>
    )
}