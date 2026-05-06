import { useEffect } from "react"
import {
    createChip,
    deleteChipsByGame,
    lockChip,
    moveChip,
    unlockChip
} from "../features/games/model/gameSlice"
import { useAppDispatch } from "../common/hooks/hooks"
import type { Socket } from "socket.io-client"

export const useChipSockets = (socket: Socket | null) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!socket) return

        const onMoved = (chip: any) => dispatch(moveChip(chip))
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
    }, [socket])
}