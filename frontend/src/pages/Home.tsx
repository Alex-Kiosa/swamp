import {Link} from "react-router";
import {useSelector} from "react-redux";
import type {RootState} from "../app/store.ts";

export const Home = () => {
    const isAuth = useSelector((state: RootState) => state.user.isAuth)

    return (
        <div className="text-center mt-8">
            <h2 className="text-6xl mb-8">Игра путь через болото</h2>
            <p>Никакой скромности, это одна из лучших трансформационных игр среди существующих, и она – сказочно невероятная! Поработайте с ее помощью с любой сложной целью в любой сфере вашей жизни.</p>

            <p>В приятной игровой атмосфере вы исследуете свою цель с самых разных сторон. Игра подскажет наилучшие пути, позволит преодолеть любые препятствия, создать правильное состояние, получить ценнейшие инсайты.</p>

            <p>На Болоте вы встретите сказочных существ, которые предложат вам интереснейшие развивающие квесты. Новое видение ситуации, мудрые подсказки жителей болот и игроков, удивительные сценарии, которые так похожи на то, что происходит с вами в реальной жизни!</p>

            <p>Сказка станет для вас целебной и откроет секреты, о которых вы не подозревали и которые так важны для вас и достижения ваших целей именно сейчас.</p>

            {!isAuth ?
                <div className="mt-8 flex justify-center gap-3">
                    <Link to="/login" role="button" className="btn btn-wide btn-primary text-base">
                        Войти
                    </Link>
                    <Link to="/signup" role="button" className="btn btn-wide">
                        Зарегистрироваться
                    </Link>
                </div>
                :
                <div className="mt-8 flex justify-center gap-3">
                    <Link to="/account" role="button" className="btn btn-wide btn-primary text-base">
                        Перейти в личный кабинет
                    </Link>
                </div>
            }
        </div>
    )
}

