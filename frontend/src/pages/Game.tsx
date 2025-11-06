import {useParams} from "react-router";
import {useEffect} from "react";
import {NotFound} from "./NotFound.tsx";
import {useAppDispatch, useAppSelector} from "../common/hooks/hooks.ts";
import type {RootState} from "../app/store.ts";
import {gameCreateThunk} from "../features/games/actions/games-actions.ts";

export const Game = () => {
    const {roomId} = useParams()
    const game = useAppSelector((state: RootState) => state.game);
    const dispatch = useAppDispatch();

    if (!game) {
        return <NotFound/>
    }

    useEffect(() => {
        dispatch(gameCreateThunk)
    }, []);

    return (
        <div>Hello. It's your game</div>
    )
}