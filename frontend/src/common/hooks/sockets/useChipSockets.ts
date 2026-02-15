import { useEffect } from "react"
import {socket} from "../../../socket.ts";
import {
    createChip,
    deleteChipsByGame,
    lockChip,
    moveChip,
    unlockChip
} from "../../../features/games/model/game-reducer.ts";
import {useAppDispatch} from "../hooks.ts";


export const useChipSockets = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const onMoved = (chip: any) => {
            dispatch(moveChip(chip))
        }
        const onCreated = (chip: any) => dispatch(createChip(chip))
        const onDeleted = () => dispatch(deleteChipsByGame())
        const onLocked = ({ chipId }: any) => dispatch(lockChip(chipId))
        const onUnlocked = ({ chipId }: any) => dispatch(unlockChip(chipId))
        const onBulkUnlock = ({ chipIds }: any) =>
            chipIds.forEach((id: string) => dispatch(unlockChip(id)))

        socket.on("chip:moved", onMoved)
        socket.on("chip:created", onCreated)
        socket.on("chips:deleted", onDeleted)
        socket.on("chip:locked", onLocked)
        socket.on("chip:unlocked", onUnlocked)
        socket.on("chips:unlocked", onBulkUnlock)

        return () => {
            socket.off("chip:moved", onMoved)
            socket.off("chip:created", onCreated)
            socket.off("chips:deleted", onDeleted)
            socket.off("chip:locked", onLocked)
            socket.off("chip:unlocked", onUnlocked)
            socket.off("chips:unlocked", onBulkUnlock)
        }
    }, [])
}