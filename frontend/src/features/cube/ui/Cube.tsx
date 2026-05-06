import React, { useEffect, useState } from "react"
import styles from "./Cube.module.css"
import { useCubeSockets } from "../../../sockets/useCubeSockets.ts"
import type { Socket } from "socket.io-client"

type CubeProps = {
    gameId: string
    socket: Socket | null
}

const rotations: Record<number, { x: number; y: number }> = {
    1: { x: 0, y: 0 },        // front
    2: { x: 90, y: 0 },       // bottom -> rotateX(+90)
    3: { x: 0, y: -90 },      // right -> rotateY(-90)
    4: { x: 0, y: 90 },       // left -> rotateY(+90)
    5: { x: -90, y: 0 },      // top -> rotateX(-90)
    6: { x: 0, y: 180 },      // back
}

// небольшой базовый наклон чтобы куб был 3D даже в статике
const BASE_TILT = { x: -15, y: 20 }

export const Cube: React.FC<CubeProps> = ({ gameId, socket }) => {
    const [rotation, setRotation] = useState(BASE_TILT)
    const [isRolling, setIsRolling] = useState(false)
    const [cubeValue, setCubeValue] = useState(1)
    const [rollId, setRollId] = useState<number | null>(null)
    const [spins, setSpins] = useState(4)

    const rollCube = () => {
        if (isRolling) return
        if (!socket) return // сокет ещё не создан

        socket.emit("cube:roll", { gameId })
    }

    // подписка на socket события (rolling / rolled)
    useCubeSockets(
        socket,
        setIsRolling,
        setCubeValue,
        setRollId,
        setSpins
    )

    // получаем state кубикa для нового игрока из базы
    useEffect(() => {
        if (!socket) return

        const handlerGameState = ({ cube }: { cube: number }) => {
            setCubeValue(cube)

            const base = rotations[cube]

            setRotation({
                x: BASE_TILT.x + base.x,
                y: BASE_TILT.y + base.y
            })
        }

        socket.on("cube:state", handlerGameState)

        return () => {
            socket.off("cube:state", handlerGameState)
        }
    }, [socket])

    // синхронизация кубика для игроков при броске
    useEffect(() => {
        if (!rollId) return

        const base = rotations[cubeValue]
        const extra = 360 * spins

        setRotation(prev => {

            // убираем базовый наклон перед нормализацией
            const rawX = prev.x - BASE_TILT.x
            const rawY = prev.y - BASE_TILT.y

            const normalizedX = rawX % 360
            const normalizedY = rawY % 360

            return {
                x: prev.x + extra + (base.x - normalizedX),
                y: prev.y + extra + (base.y - normalizedY)
            }
        })

    }, [rollId, cubeValue, spins])

    return (
        <div className={styles.wrap}>
            <div
                className={`${styles.cube} ${isRolling ? styles.disabled : ""}`}
                onClick={rollCube}
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                }}
            >
                <Face value={1} className={styles.front} />
                <Face value={6} className={styles.back} />
                <Face value={3} className={styles.right} />
                <Face value={4} className={styles.left} />
                <Face value={5} className={styles.top} />
                <Face value={2} className={styles.bottom} />
            </div>
        </div>
    )
}

const Face: React.FC<{ value: number; className: string }> = ({
                                                                  value,
                                                                  className
                                                              }) => (
    <div className={`${className} ${styles.face}`}>
        <div className={`${styles.dots} ${styles[`dots-${value}`]}`}>
            {Array.from({ length: value }).map((_, i) => (
                <span key={i} className={styles.dot} />
            ))}
        </div>
    </div>
)