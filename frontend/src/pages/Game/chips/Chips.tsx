import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks.ts";
import {selectGameChips} from "../../../features/games/model/gameSelectors.ts";
import {Chip} from "./Chip.tsx";
import {useEffect} from "react";
import {socket} from "../../../socket.ts";
import {createChip, deleteChipsByGame, moveChip} from "../../../features/games/model/game-reducer.ts";

export const Chips = () => {
    const chips = useAppSelector(selectGameChips)
    const dispatch = useAppDispatch()

    useEffect(() => {
        socket.on("chip:moved", (chip) => {
            dispatch(moveChip(chip))
        })

        socket.on("chip:created", (chip) => {
            dispatch(createChip(chip))
        })

        socket.on("chips:deleted", () => {
            dispatch(deleteChipsByGame())
        })

        return () => {
            socket.off("chip:moved")
            socket.off("chip:created")
            socket.off("chips:deleted")
        }
    }, [])

    return chips.map(chip => <Chip key={chip._id} chip={chip}/> )
}