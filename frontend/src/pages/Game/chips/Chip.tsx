import type {ChipType} from "../../../features/games/chips.types.ts";
import React, {type RefObject, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks.ts";
import {moveChipThunk} from "../../../features/games/actions/games-actions.ts";
import {socket} from "../../../sockets/socket.ts";
import {selectGame} from "../../../features/games/model/gameSelectors.ts";

type Props = {
    chip: ChipType
    boardRef: RefObject<HTMLDivElement | null>
}

export const Chip = ({chip, boardRef}: Props) => {
    const {gameId} = useAppSelector(selectGame)
    const dispatch = useAppDispatch()

    const {position, color, shape, isLocked} = chip

    // position в пикселях
    const [tempPos, setTempPos] = useState(position)

    const posRef = useRef(position)
    const draggingRef = useRef(false)
    const offsetRef = useRef({x: 0, y: 0})

    const HALF_SIZE = 20 // половина 40px

    // синхронизация с сервером
    useEffect(() => {
        if (!draggingRef.current) {
            setTempPos(position)
            posRef.current = position
        }
    }, [position])

    const onMouseDownHandler = (e: React.MouseEvent) => {
        if (isLocked || !boardRef.current) return

        draggingRef.current = true

        socket.emit("chip:drag:start", {chipId: chip._id, gameId})

        const rect = boardRef.current.getBoundingClientRect()

        // offset в пикселях
        offsetRef.current = {
            x: e.clientX - rect.left - tempPos.x,
            y: e.clientY - rect.top - tempPos.y
        }

        window.addEventListener("mousemove", onMouseMoveHandler)
        window.addEventListener("mouseup", onMouseUpHandler)
    }

    const onMouseMoveHandler = (e: MouseEvent) => {
        if (!draggingRef.current || !boardRef.current) return

        const rect = boardRef.current.getBoundingClientRect()

        let x = e.clientX - rect.left - offsetRef.current.x
        let y = e.clientY - rect.top - offsetRef.current.y

        // clamp с учетом размера фишки
        x = Math.max(HALF_SIZE, Math.min(rect.width - HALF_SIZE, x))
        y = Math.max(HALF_SIZE, Math.min(rect.height - HALF_SIZE, y))

        const newPos = {x, y}

        posRef.current = newPos
        setTempPos(newPos)
    }

    const onMouseUpHandler = () => {
        draggingRef.current = false

        window.removeEventListener("mousemove", onMouseMoveHandler)
        window.removeEventListener("mouseup", onMouseUpHandler)

        dispatch(moveChipThunk(chip._id, posRef.current))

        socket.emit("chip:drag:end", {chipId: chip._id, gameId})
    }

    return (
        <div
            onMouseDown={onMouseDownHandler}
            style={{
                position: "absolute",
                left: tempPos.x,   // 🔥 пиксели
                top: tempPos.y,    // 🔥 пиксели
                transform: "translate(-50%, -50%)",
                width: "40px",
                height: "40px",
                backgroundColor: color,
                borderRadius: shape === "Circle" ? "50%" : "4px",
                clipPath:
                    shape === "Triangle"
                        ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                        : "none",
                cursor: isLocked ? "not-allowed" : "grab",
                opacity: isLocked ? 0.5 : 1,
                transition: draggingRef.current
                    ? "none"
                    : "left 0.2s ease, top 0.2s ease",
            }}
        />
    )
}