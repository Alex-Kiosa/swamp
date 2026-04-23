import {useAppSelector} from "../../../common/hooks/hooks.ts";
import {selectGameChips} from "../../../features/games/model/gameSelectors.ts"
import {Chip} from "./Chip.tsx"
import type {RefObject} from "react"

type ChipsProps = {
    boardRef: RefObject<HTMLDivElement | null>
}

export const Chips = ({ boardRef }:ChipsProps) => {
    const chips = useAppSelector(selectGameChips)

    return chips.map(chip => (
        <Chip key={chip._id} chip={chip} boardRef={boardRef}/>
    ))
}