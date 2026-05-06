import type { ChipType } from "../../../features/games/chips.types.ts"
import React, { type RefObject, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../common/hooks/hooks.ts"
import { moveChipThunk } from "../../../features/games/actions/games-actions.ts"
import { selectGame } from "../../../features/games/model/gameSelectors.ts"
import type { Socket } from "socket.io-client"

type Props = {
    chip: ChipType
    boardRef: RefObject<HTMLDivElement | null>
    socket: Socket | null
}

export const Chip = ({ chip, boardRef, socket }: Props) => {
    const { gameId } = useAppSelector(selectGame)
    const dispatch = useAppDispatch()

    const { position, color, shape, isLocked } = chip

    const [tempPos, setTempPos] = useState(position)

    const posRef = useRef(position)
    const draggingRef = useRef(false)
    const offsetRef = useRef({ x: 0, y: 0 })

    // sync с сервером
    useEffect(() => {
        if (!draggingRef.current) {
            setTempPos(position)
            posRef.current = position
        }
    }, [position])

    const onMouseDownHandler = (e: React.MouseEvent) => {
        if (isLocked || !boardRef.current) return
        if (!socket) return

        draggingRef.current = true

        socket.emit("chip:drag:start", { chipId: chip._id, gameId })

        const rect = boardRef.current.getBoundingClientRect()

        const currentX = tempPos.x * rect.width
        const currentY = tempPos.y * rect.height

        offsetRef.current = {
            x: e.clientX - rect.left - currentX,
            y: e.clientY - rect.top - currentY
        }

        window.addEventListener("mousemove", onMouseMoveHandler)
        window.addEventListener("mouseup", onMouseUpHandler)
    }

    const onMouseMoveHandler = (e: MouseEvent) => {
        if (!draggingRef.current || !boardRef.current) return

        const rect = boardRef.current.getBoundingClientRect()

        let xPx = e.clientX - rect.left - offsetRef.current.x
        let yPx = e.clientY - rect.top - offsetRef.current.y

        // 🔥 clamp через %
        const HALF_SIZE_X = rect.width * 0.02
        const HALF_SIZE_Y = rect.height * 0.02

        xPx = Math.max(HALF_SIZE_X, Math.min(rect.width - HALF_SIZE_X, xPx))
        yPx = Math.max(HALF_SIZE_Y, Math.min(rect.height - HALF_SIZE_Y, yPx))

        let x = xPx / rect.width
        let y = yPx / rect.height

        x = Math.max(0, Math.min(1, x))
        y = Math.max(0, Math.min(1, y))

        const newPos = { x, y }

        posRef.current = newPos
        setTempPos(newPos)
    }

    const onMouseUpHandler = () => {
        draggingRef.current = false

        window.removeEventListener("mousemove", onMouseMoveHandler)
        window.removeEventListener("mouseup", onMouseUpHandler)

        dispatch(moveChipThunk(chip._id, posRef.current))

        if (!socket) return

        socket.emit("chip:drag:end", { chipId: chip._id, gameId })
    }

    return (
        <div
            onMouseDown={onMouseDownHandler}
            style={{
                position: "absolute",

                // размеры фишки в процентах
                left: `${tempPos.x * 100}%`,
                top: `${tempPos.y * 100}%`,

                transform: "translate(-50%, -50%)",
                width: "3.5%",
                aspectRatio: "1 / 1",

                background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 40%),${color}`,
                borderRadius: shape === "Circle" ? "50%" : "4px",
                clipPath:
                    shape === "Triangle"
                        ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                        : "none",
                boxShadow:
                    `inset 0 2px 4px rgba(255,255,255,0.4),
                    inset 0 -3px 6px rgba(0,0,0,0.4),
                    0 4px 10px rgba(0,0,0,0.3)`,

                cursor: isLocked ? "not-allowed" : "grab",
                opacity: isLocked ? 0.5 : 1,

                transition: draggingRef.current
                    ? "none"
                    : "left 0.2s ease, top 0.2s ease",
            }}
        />
    )
}