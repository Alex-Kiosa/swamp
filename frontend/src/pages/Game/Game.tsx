import {useParams} from "react-router";
import {useEffect} from "react";
import {NotFound} from "../NotFound.tsx";
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks.ts";
import type {RootState} from "../../app/store.ts";
import {createGameThunk} from "../../features/games/actions/games-actions.ts";
import styles from "./Game.module.css"
import {Chip} from "../../components/chip/Chip.tsx";

export const Game = () => {
    const {roomId} = useParams()
    const game = useAppSelector((state: RootState) => state.game);
    const dispatch = useAppDispatch();

    if (!game) {
        return <NotFound/>
    }

    useEffect(() => {
        dispatch(createGameThunk)
    }, []);

    return (
        <div className={styles.wrap}>
            Hello. It's your game
            <Chip/>
        </div>
    )
}