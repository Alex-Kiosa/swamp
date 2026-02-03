import {useAppSelector} from "../../../common/hooks/hooks.ts";
import {selectGameChips} from "../../../features/games/model/gameSelectors.ts";
import {Chip} from "./Chip.tsx";

export const Chips = () => {
    const chips = useAppSelector(selectGameChips)

    return chips.map(chip => <Chip key={chip._id} chip={chip}/> )
}