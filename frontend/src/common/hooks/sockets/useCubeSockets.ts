import { useEffect } from "react"
import { socket } from "../../../socket"

export const useCubeSockets = (
    setIsRolling: (v: boolean) => void,
    setCubeValue: (v: number) => void,
    setRollId: (v: number) => void
) => {
    useEffect(() => {
        const onRolling = () => {
            setIsRolling(true)
        }
        const onRolled = ({ value, rollId }: { value: number, rollId: number}) => {
            setCubeValue(value)
            setRollId(rollId)
            setIsRolling(false)
            // console.log(value)
            // console.log(rollId)
        }

        socket.on("cube:rolling", onRolling)
        socket.on("cube:rolled", onRolled)

        return () => {
            socket.off("cube:rolling", onRolling)
            socket.off("cube:rolled", onRolled)
        }
    }, [setIsRolling, setCubeValue, setRollId])
}
