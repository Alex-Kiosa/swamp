import { useEffect } from "react"
import { socket } from "./socket.ts"

type RolledPayload = {
    value: number
    rollId: number
    spins: number
}

export const useCubeSockets = (
    setIsRolling: (v: boolean) => void,
    setCubeValue: (v: number) => void,
    setRollId: (v: number) => void,
    setSpins: (v: number) => void
) => {
    useEffect(() => {

        const onRolling = () => {
            setIsRolling(true)
        }

        const onRolled = ({ value, rollId, spins }: RolledPayload) => {
            setCubeValue(value)
            setSpins(spins)
            setRollId(rollId)
            setIsRolling(false)
        }

        socket.on("cube:rolling", onRolling)
        socket.on("cube:rolled", onRolled)

        return () => {
            socket.off("cube:rolling", onRolling)
            socket.off("cube:rolled", onRolled)
        }

    }, [setIsRolling, setCubeValue, setRollId, setSpins])
}