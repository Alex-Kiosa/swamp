import womenAvatar from '../../assets/women-avatar.jpg';
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks.ts";
import {Link} from "react-router";
import {useEffect} from "react";
import {createGameThunk, deleteGameThunk, getGameByUserThunk} from "../../features/games/actions/games-actions.ts";
import {selectGame} from "../../features/games/model/gameSelectors.ts";
import {selectCurrentUser} from "../../features/users/model/userSelectors.ts";
import {ShareLinkButton} from "../button/shareLinkButton.tsx";

type AvatarProps = {
    src?: string
    className?: string
}

export const Profile = () => {
    const {name, email, roles = []} = useAppSelector(selectCurrentUser)
    const gameId = useAppSelector(selectGame).gameId
    const dispatch = useAppDispatch()
    const gameUrl =  `${window.location.origin}/game/${gameId}`

    const deleteGameHandler = () => {
        if(!gameId) return
        dispatch(deleteGameThunk(gameId))
    }

    const createGameHandler = () => {
        dispatch(createGameThunk())
    }

    useEffect(() => {
        // TODO: протестировать санку с несколькими юзерами
        dispatch(getGameByUserThunk())
    }, [])

    const checkUserRole = () => {
        return roles.includes("ADMIN") ? "Админ" : roles.includes("HOST") ? "Ведущий" : "Гость"
    }

    return (
        <div className="card bg-white w-96 shadow-sm">
            <figure className="mt-6"><Avatar/></figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{name}</h2>
                <p><b>Email:</b> {email}</p>
                <p><b>Тип аккаунта:</b> {checkUserRole()}</p>
                <div className="">
                    {
                        gameId ? <>
                                <Link
                                    to={gameUrl}
                                    role="button"
                                    className="mb-4 btn btn-wide btn-primary">
                                    Открыть
                                    игру
                                </Link>
                                <ShareLinkButton styles={"btn btn-wide"} urlForCopy={gameUrl}/>
                                <button className="btn btn-wide btn-error mt-8" onClick={deleteGameHandler}>Удалить игру</button>
                            </> :

                            <button
                                role="button"
                                className="btn btn-wide btn-primary text-base"
                                onClick={createGameHandler}
                            >
                                Создать игру
                            </button>
                    }
                </div>
            </div>
        </div>
    )
}

export const Avatar = ({
                           className = "rounded-xl", src = womenAvatar
                       }: AvatarProps) => {
    return <img src={src} alt="Аватар" className={className}/>
}