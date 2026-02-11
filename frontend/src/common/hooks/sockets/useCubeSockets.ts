import { useEffect } from "react"
import {socket} from "../../../socket.ts";

export const useCubeSockets = (
    setIsRolling: (v: boolean) => void,
    setCubeValue: (v: number) => void
) => {
    useEffect(() => {
        const onRolling = () => setIsRolling(true)
        const onRolled = ({ value }: any) => {
            setIsRolling(false)
            setCubeValue(value)
        }

        socket.on("cube:rolling", onRolling)
        socket.on("cube:rolled", onRolled)

        return () => {
            socket.off("cube:rolling", onRolling)
            socket.off("cube:rolled", onRolled)
        }
    }, [])
}