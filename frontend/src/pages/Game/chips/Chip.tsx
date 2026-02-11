import type {ChipType} from "../../../features/games/chips.types.ts";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks.ts";
import {moveChipThunk} from "../../../features/games/actions/games-actions.ts";
import {socket} from "../../../socket.ts";
import { selectGame } from "../../../features/games/model/gameSelectors.ts";

type Props = {
    chip: ChipType
}

export const Chip = ({chip}: Props) => {
    const {gameId} = useAppSelector(selectGame)
    const dispatch = useAppDispatch()
    const {position, color, shape, isLocked} = chip
    const [tempPos, setTempPos] = useState(chip.position)

    const posRef = useRef(position)
    const draggingRef = useRef(false)
    const offsetRef = useRef({x: 0, y: 0})

    // synchronization if final position get from the server
    useEffect(() => {
        if (!draggingRef.current) {
            setTempPos(position)
            posRef.current = position
        }
    }, [position])

    const onMouseDownHandler = (e: React.MouseEvent) => {
        if (isLocked) return

        draggingRef.current = true

        socket.emit("chip:drag:start", {chipId: chip._id, gameId})

        offsetRef.current = {
            x: e.clientX - tempPos.x,
            y: e.clientY - tempPos.y
        }

        window.addEventListener("mousemove", onMouseMoveHandler)
        window.addEventListener("mouseup", onMouseUpHandler)
    }

    const onMouseMoveHandler = (e: MouseEvent) => {
        // предохранитель, который не даёт mousemove
        // двигать элемент вне активного drag-состояния.
        if (!draggingRef.current) return

        const newPos = {
            x: e.clientX - offsetRef.current.x,
            y: e.clientY - offsetRef.current.y
        }

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
                left: tempPos.x,
                top: tempPos.y,
                width: 50,
                height: 50,
                backgroundColor: color,
                borderRadius: shape === "Circle" ? "50%" : "4px",
                clipPath:
                    shape === "Triangle"
                        ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                        : "none",
                cursor: isLocked ? "not-allowed" : "grab",
                opacity: isLocked ? 0.5 : 1,
                transition: draggingRef.current ? "none" : "left 0.2s ease, top 0.2s ease",
            }}
        />
    )
}