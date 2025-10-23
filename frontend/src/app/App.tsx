import './App.css'
import {Link} from "react-router";

function App() {
    return (
        <div className={"text-center"}>
            <h2 className="text-6xl mb-8">Игра путь через болото</h2>
            <p>Описание игры описание игры фаыва выаыва ваыва аываываыва ваыва ыва ыв аы ва</p>
            <p>Описание игры описание игры фаыва выа vxcvxc xcvxf 5 b dbыва ваыва аываываыва ваыва ыва ыв аы ва</p>
            <div className="mt-8 flex justify-center gap-3">
                <Link
                    to={"/login"}
                    role="button"
                    className="btn btn-wide btn-primary text-base"
                >Войти</Link>
                <Link
                    to={"/signup"}
                    role="button"
                    className="btn btn-wide"
                >Зарегистрироваться</Link>

            </div>
        </div>
    )
}

export default App
