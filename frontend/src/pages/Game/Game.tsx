import {useEffect} from "react";
import {NotFound} from "../NotFound.tsx";
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks.ts";
import {getGameThunk} from "../../features/games/actions/games-actions.ts";
import styles from "./Game.module.css"
import {Chips} from "./chips/Chips.tsx";
import {selectGame} from "../../features/games/model/gameSelectors.ts";
import {Fab} from "./FAB/Fab.tsx";

export const Game = () => {
    const game = useAppSelector(selectGame);
    const dispatch = useAppDispatch();

    if (!game) {
        return <NotFound/>
    }

    useEffect(() => {
        dispatch(getGameThunk())
    }, []);

    return (
        <div className={styles.wrap}>
            <Chips/>
            <Fab/>
        </div>
    )
}