import React, { useEffect, useState } from "react"
import styles from "./Cube.module.css"
import { socket } from "../../../socket"
import { useCubeSockets } from "../../../common/hooks/sockets/useCubeSockets.ts"

type CubeProps = {
    gameId: string
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

export const Cube: React.FC<CubeProps> = ({ gameId}) => {
    const [rotation, setRotation] = useState(BASE_TILT)
    const [isRolling, setIsRolling] = useState(false)
    const [cubeValue, setCubeValue] = useState(1)
    const [rollId, setRollId] = useState<number | null>(null)

    useCubeSockets(setIsRolling, setCubeValue, setRollId)

    useEffect(() => {
        if(!rollId) return

        const base = rotations[cubeValue]

        const spins = 3 + Math.floor(Math.random() * 2)
        const extra = 360 * spins

        setRotation({
            x: BASE_TILT.x + extra + base.x,
            y: BASE_TILT.y + extra + base.y
        })
    }, [rollId])

    const rollCube = () => {
        if (isRolling) return
        socket.emit("cube:roll", { gameId })
    }

    return (
        <div className={styles.scene}>
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