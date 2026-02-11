import styles from "./Cube.module.css"

type СubeProps = {
    value?: number
    isRolling?: boolean
}

export const Cube = ({value = 1, isRolling = false}: СubeProps) => {
    return <div className={`${styles.cube} ${isRolling ? styles.rolling : ""}`}>
        {isRolling ? "🎲" : value}
    </div>
}