import { useAppSelector } from "../../../common/hooks/hooks.ts"
import { selectGameChips } from "../../../features/games/model/gameSelectors.ts"
import { Chip } from "./Chip.tsx"
import type { RefObject } from "react"
import type { Socket } from "socket.io-client"

type ChipsProps = {
    boardRef: RefObject<HTMLDivElement | null>
    socket: Socket | null
}

export const Chips = ({ boardRef, socket }: ChipsProps) => {
    const chips = useAppSelector(selectGameChips)

    return chips.map(chip => (
        <Chip
            key={chip._id}
            chip={chip}
            boardRef={boardRef}
            socket={socket}
        />
    ))
}