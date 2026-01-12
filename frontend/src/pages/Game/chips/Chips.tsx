import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks.ts";
import {useEffect} from "react";
import {getChipsThunk} from "../../../features/games/actions/games-actions.ts";
import {selectGameChips, selectGameId} from "../../../features/games/model/gameSelectors.ts";
import {Chip} from "./Chip.tsx";

export const Chips = () => {
    const chips = useAppSelector(selectGameChips)
    const dispatch = useAppDispatch();
    const gameId = useAppSelector(selectGameId)

    useEffect(() => {
        if (!gameId) return

        dispatch(getChipsThunk(gameId))
    }, [gameId]);

    return chips.map(chip => <Chip key={chip._id} chip={chip}/> )
}