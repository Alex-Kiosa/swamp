import styles from "./Loading.module.css"

export const Loading = () => {
    const wrap = styles.wrap

    return <div className={wrap}>
        <div className="loading loading-spinner text-primary loading-xl"></div>
        Загрузка
    </div>
}