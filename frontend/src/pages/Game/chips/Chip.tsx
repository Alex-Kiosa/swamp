import type {ChipType} from "../../../features/games/chips.types.ts";
import {useEffect, useRef, useState} from "react";
import {useAppDispatch} from "../../../common/hooks/hooks.ts";
import {moveChipThunk} from "../../../features/games/actions/games-actions.ts";
import * as React from "react";

type Props = {
    chip: ChipType
}

export const Chip = ({chip}: Props) => {
    const dispatch = useAppDispatch()
    const {position, color, shape} = chip
    const [tempPos, setTempPos] = useState(chip.position)

    const posRef = useRef(position)
    const draggingRef = useRef(false)
    const offsetRef = useRef({x: 0, y: 0})

    // synchronization if final position get from the server
    useEffect(() => {
        setTempPos(position)
        // posRef.current = position
    }, [position])

    const onMouseDownHandler = (e: React.MouseEvent) => {
        draggingRef.current = true

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
                cursor: "grab",
            }}
        />
    )
}