import {Link} from "react-router";

export const NotFound = () => {
    return (
        <div className="hero">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold opacity-10 lg:text-7xl xl:text-9xl">Ошибка 404</h1>
                    <p className="mb-5">Такой страницы не существует</p>
                    <Link className="btn" role={"button"} to="/">Вернуться на главную</Link>
                </div>
            </div>
        </div>
    )
}