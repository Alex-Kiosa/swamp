import {Link} from "react-router"

type Props = {
    title?: string
    description?: string
}

export const NotFound = ({title = "Ошибка 404", description = "Такой страницы не существует"}: Props) => {
    return (
        <div className="hero">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold opacity-10 lg:text-7xl xl:text-9xl">{title}</h1>
                    <p className="mb-5">{description}</p>
                    <Link className="btn" role={"button"} to="/">Вернуться на главную</Link>
                </div>
            </div>
        </div>
    )
}